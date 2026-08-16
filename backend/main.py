# ============================================================
# backend/main.py
# Resume Screening AI - FastAPI Backend
# ============================================================

import os
import shutil
from datetime import datetime
from typing import Optional

from bson import ObjectId

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field


# ============================================================
# INTERNAL IMPORTS
# ============================================================

# Resume parser
from utils.parser import extract_text

# ATS / NLP
from services.ats import (
    analyze_resume,
    calculate
)

# Resume ↔ Job matching
from services.matcher import (
    calculate_match
)

# Recommendations
from services.recommendation import (
    gen_recommendation
)

# Chatbot
from services.chatbot import (
    ask_resume_bot
)

# RAG
from services.rag import (
    store_resume_embeddings,
    delete_resume_embeddings
)

# Skills
from data.skills import SKILLS

# Database
from database.db import (
    candidates_collection,
    users_collection
)

# Authentication
from auth.hashing import (
    hash_password,
    verify_password
)

from auth.jwt_handler import (
    create_access_token
)

from auth.dependencies import (
    get_current_user
)


# ============================================================
# APP INITIALIZATION
# ============================================================

app = FastAPI(
    title="Resume Screening AI API",
    description=(
        "AI-powered resume screening, ATS analysis, "
        "job matching, recommendations and career assistant."
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# REQUEST MODELS
# ============================================================

class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class ChatRequest(BaseModel):

    # Existing saved resume
    resume_id: Optional[str] = None

    # Optional direct resume context
    resume_text: Optional[str] = None

    # User's question
    question: str

    # Optional analysis sent by frontend
    analysis: dict = Field(
        default_factory=dict
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Resume Screening API Running"
    }


# ============================================================
# ANALYZE RESUME
# ============================================================

@app.post("/api/analyze")
async def analyze_resume_endpoint(

    file: UploadFile = File(...),

    # Optional Job Description
    job_description: str = Form(""),

    # Authenticated user
    current_user: dict = Depends(
        get_current_user
    )
):

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No resume file provided."
        )

    # --------------------------------------------------------
    # Validate extension
    # --------------------------------------------------------

    original_filename = file.filename

    extension = os.path.splitext(
        original_filename
    )[1].lower()

    if extension not in [
        ".pdf",
        ".docx"
    ]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Only PDF and DOCX files are supported."
            )
        )

    # --------------------------------------------------------
    # Safe filename
    # --------------------------------------------------------

    safe_filename = os.path.basename(
        original_filename
    )

    file_location = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )

    try:

        # ====================================================
        # 1. SAVE UPLOADED FILE
        # ====================================================

        with open(
            file_location,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # ====================================================
        # 2. EXTRACT RESUME TEXT
        # ====================================================

        extracted_text = extract_text(
            file_location
        )

        if not extracted_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No readable text was found "
                    "in the uploaded resume."
                )
            )

        # ====================================================
        # 3. NLP / RESUME ANALYSIS
        # ====================================================

        resume_analysis = analyze_resume(
            extracted_text
        )

        # ----------------------------------------------------
        # Extract detected hard skills
        # ----------------------------------------------------

        skills = resume_analysis.get(
            "hard_skills",
            []
        )

        # ====================================================
        # 4. RESUME ↔ JD MATCHING
        # ====================================================

        match_result = calculate_match(

            resume_text=extracted_text,

            jd_text=job_description,

            resume_skills=skills,

            skill_dictionary=SKILLS
        )

        # ====================================================
        # 5. ATS ANALYSIS
        # ====================================================

        ats_result = calculate(

            skills,

            job_description
        )

        # ====================================================
        # 6. RECOMMENDATIONS
        # ====================================================

        # Compatible with your current
        # recommendation.py:
        #
        # gen_recommendation(resume_skill, jd_text)

        recommendations = gen_recommendation(

            resume_skill=skills,

            jd_text=job_description
        )

        # ====================================================
        # 7. SAVE COMPLETE RESULT TO MONGODB
        # ====================================================

        candidate_data = {

            "filename":
                safe_filename,

            "resume_text":
                extracted_text,

            "skills":
                skills,

            "resume_analysis":
                resume_analysis,

            # Matching
            "semantic_score":
                match_result.get(
                    "semantic_score",
                    0
                ),

            "match_score":
                match_result.get(
                    "match_score",
                    0
                ),

            "skill_score":
                match_result.get(
                    "skill_score",
                    0
                ),

            "matched_skills":
                match_result.get(
                    "matched_skills",
                    []
                ),

            "missing_skills":
                match_result.get(
                    "missing_skills",
                    []
                ),

            "required_skills":
                match_result.get(
                    "required_skills",
                    []
                ),

            # ATS
            "ats_score":
                ats_result.get(
                    "ats_score",
                    0
                ),

            "ats_analysis":
                ats_result,

            # Recommendations
            "recommendations":
                recommendations,

            # JD
            "job_description":
                job_description,

            # User
            "user_id":
                current_user["sub"],

            # Timestamp
            "created_at":
                datetime.utcnow()
        }

        result = candidates_collection.insert_one(
            candidate_data
        )

        # ====================================================
        # 8. GET MONGODB RESUME ID
        # ====================================================

        resume_id = str(
            result.inserted_id
        )

        # ====================================================
        # 9. STORE RAG EMBEDDINGS
        # ====================================================

        store_resume_embeddings(

            resume_text=extracted_text,

            resume_id=resume_id
        )

        # ====================================================
        # 10. RETURN COMPLETE RESPONSE
        # ====================================================

        return {

            "success": True,

            "resume": {

                "id":
                    resume_id,

                "filename":
                    safe_filename,

                "preview":
                    extracted_text[:1500]
            },

            "analysis": {

                "hard_skills":
                    resume_analysis.get(
                        "hard_skills",
                        []
                    ),

                "skills_by_category":
                    resume_analysis.get(
                        "skills_by_category",
                        {}
                    ),

                "soft_skills":
                    resume_analysis.get(
                        "soft_skills",
                        []
                    ),

                "experience_years":
                    resume_analysis.get(
                        "experience_years",
                        0
                    ),

                "education":
                    resume_analysis.get(
                        "education",
                        []
                    ),

                "job_roles":
                    resume_analysis.get(
                        "job_roles",
                        []
                    ),

                "contact":
                    resume_analysis.get(
                        "contact",
                        {}
                    ),

                "total_skills":
                    resume_analysis.get(
                        "total_skills",
                        0
                    )
            },

            "matching": {

                "match_score":
                    match_result.get(
                        "match_score",
                        0
                    ),

                "semantic_score":
                    match_result.get(
                        "semantic_score",
                        0
                    ),

                "skill_score":
                    match_result.get(
                        "skill_score",
                        0
                    ),

                "matched_skills":
                    match_result.get(
                        "matched_skills",
                        []
                    ),

                "missing_skills":
                    match_result.get(
                        "missing_skills",
                        []
                    ),

                "required_skills":
                    match_result.get(
                        "required_skills",
                        []
                    ),

                "has_job_description":
                    match_result.get(
                        "has_job_description",
                        False
                    )
            },

            "ats":
                ats_result,

            "recommendations":
                recommendations
        }

    except HTTPException:

        raise

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        print(
            "Resume analysis error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "An unexpected error occurred "
                "while analyzing the resume."
            )
        )

    finally:

        # ====================================================
        # DELETE TEMPORARY FILE
        # ====================================================

        if os.path.exists(
            file_location
        ):

            try:

                os.remove(
                    file_location
                )

            except Exception:

                pass


# ============================================================
# CHATBOT
# ============================================================

@app.post("/api/chat")
def chat_with_bot(

    data: ChatRequest,

    current_user: dict = Depends(
        get_current_user
    )
):

    resume_text = data.resume_text

    analysis = data.analysis

    # --------------------------------------------------------
    # Validate question
    # --------------------------------------------------------

    if not data.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    # ========================================================
    # GET SAVED RESUME
    # ========================================================

    if data.resume_id:

        try:

            resume_object_id = ObjectId(
                data.resume_id
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid resume ID."
            )

        resume = candidates_collection.find_one(

            {
                "_id":
                    resume_object_id,

                "user_id":
                    current_user["sub"]
            }
        )

        if not resume:

            raise HTTPException(
                status_code=404,
                detail="Resume not found."
            )

        # ----------------------------------------------------
        # Get resume text from database
        # ----------------------------------------------------

        resume_text = resume.get(
            "resume_text",
            ""
        )

        # ----------------------------------------------------
        # Get saved analysis
        # ----------------------------------------------------

        if not analysis:

            analysis = resume.get(
                "resume_analysis",
                {}
            )

    # ========================================================
    # VALIDATE RESUME CONTEXT
    # ========================================================

    if not resume_text:

        raise HTTPException(
            status_code=400,
            detail=(
                "Resume context is required. "
                "Provide a valid resume_id."
            )
        )

    # ========================================================
    # GENERATE AI RESPONSE
    # ========================================================

    try:

        answer = ask_resume_bot(

            resume_text=resume_text,

            question=data.question,

            analysis=analysis,

            resume_id=data.resume_id or "default"
        )

    except Exception as e:

        print(
            "Chatbot error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate chatbot response."
            )
        )

    return {

        "success": True,

        "answer":
            answer
    }


# ============================================================
# REGISTER
# ============================================================

@app.post("/register")
def register(
    user: UserRegister
):

    # --------------------------------------------------------
    # Check duplicate email
    # --------------------------------------------------------

    existing_user = users_collection.find_one(

        {
            "email":
                user.email
        }
    )

    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="User already exists."
        )

    # --------------------------------------------------------
    # Hash password
    # --------------------------------------------------------

    hashed_password = hash_password(
        user.password
    )

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    user_data = {

        "username":
            user.username,

        "email":
            user.email,

        "password":
            hashed_password,

        "created_at":
            datetime.utcnow()
    }

    users_collection.insert_one(
        user_data
    )

    return {

        "success": True,

        "message":
            "User registered successfully."
    }


# ============================================================
# LOGIN
# ============================================================

@app.post("/login")
def login(
    user: UserLogin
):

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    db_user = users_collection.find_one(

        {
            "email":
                user.email
        }
    )

    if not db_user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # --------------------------------------------------------
    # Verify password
    # --------------------------------------------------------

    if not verify_password(

        user.password,

        db_user["password"]

    ):

        raise HTTPException(
            status_code=401,
            detail="Incorrect password."
        )

    # --------------------------------------------------------
    # Generate access token
    # --------------------------------------------------------

    access_token = create_access_token(

        {
            "sub":
                str(
                    db_user["_id"]
                ),

            "email":
                db_user["email"]
        }
    )

    return {

        "success": True,

        "access_token":
            access_token,

        "token_type":
            "bearer"
    }


# ============================================================
# DASHBOARD STATISTICS
# ============================================================

@app.get("/dashboard/stats")
def dashboard_stats(

    current_user: dict = Depends(
        get_current_user
    )
):

    resumes = list(

        candidates_collection.find(

            {
                "user_id":
                    current_user["sub"]
            }
        )
    )

    # --------------------------------------------------------
    # No resumes
    # --------------------------------------------------------

    if not resumes:

        return {

            "success": True,

            "total_resumes": 0,

            "average_ats": 0,

            "average_match": 0,

            "best_match": 0
        }

    # --------------------------------------------------------
    # ATS scores
    # --------------------------------------------------------

    ats_scores = [

        resume.get(
            "ats_score",
            0
        )

        for resume in resumes
    ]

    # --------------------------------------------------------
    # Match scores
    # --------------------------------------------------------

    match_scores = [

        resume.get(
            "match_score",
            resume.get(
                "semantic_score",
                0
            )
        )

        for resume in resumes
    ]

    # --------------------------------------------------------
    # Calculations
    # --------------------------------------------------------

    average_ats = (
        sum(ats_scores)
        /
        len(ats_scores)
    )

    average_match = (
        sum(match_scores)
        /
        len(match_scores)
    )

    best_match = max(
        match_scores
    )

    return {

        "success": True,

        "total_resumes":
            len(resumes),

        "average_ats":
            round(
                average_ats,
                2
            ),

        "average_match":
            round(
                average_match,
                2
            ),

        "best_match":
            round(
                best_match,
                2
            )
    }


# ============================================================
# GET USER RESUMES
# ============================================================

@app.get("/my-resumes")
def get_my_resumes(

    current_user: dict = Depends(
        get_current_user
    )
):

    resumes = list(

        candidates_collection.find(

            {
                "user_id":
                    current_user["sub"]
            },

            {
                "_id": 1,

                "filename": 1,

                "ats_score": 1,

                "semantic_score": 1,

                "match_score": 1,

                "skill_score": 1,

                "created_at": 1
            }
        ).sort(
            "created_at",
            -1
        )
    )

    # --------------------------------------------------------
    # Convert ObjectId
    # --------------------------------------------------------

    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )

    return {

        "success": True,

        "resumes":
            resumes
    }


# ============================================================
# GET SINGLE RESUME
# ============================================================

@app.get("/resume/{resume_id}")
def get_resume(

    resume_id: str,

    current_user: dict = Depends(
        get_current_user
    )
):

    # --------------------------------------------------------
    # Validate ID
    # --------------------------------------------------------

    try:

        object_id = ObjectId(
            resume_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid resume ID."
        )

    # --------------------------------------------------------
    # Find user's resume
    # --------------------------------------------------------

    resume = candidates_collection.find_one(

        {
            "_id":
                object_id,

            "user_id":
                current_user["sub"]
        }
    )

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # --------------------------------------------------------
    # Convert ObjectId
    # --------------------------------------------------------

    resume["_id"] = str(
        resume["_id"]
    )

    return {

        "success": True,

        "resume":
            resume
    }


# ============================================================
# DELETE RESUME
# ============================================================

@app.delete("/resume/{resume_id}")
def delete_resume(

    resume_id: str,

    current_user: dict = Depends(
        get_current_user
    )
):

    # --------------------------------------------------------
    # Validate ID
    # --------------------------------------------------------

    try:

        object_id = ObjectId(
            resume_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid resume ID."
        )

    # --------------------------------------------------------
    # Delete user's resume
    # --------------------------------------------------------

    result = candidates_collection.delete_one(

        {
            "_id":
                object_id,

            "user_id":
                current_user["sub"]
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # --------------------------------------------------------
    # Remove RAG data
    # --------------------------------------------------------

    delete_resume_embeddings(
        resume_id
    )

    return {

        "success": True,

        "message":
            "Resume deleted successfully."
    }


# ============================================================
# RESUME HISTORY
# ============================================================

@app.get("/resume/history")
def resume_history(

    current_user: dict = Depends(
        get_current_user
    )
):

    resumes = list(

        candidates_collection.find(

            {
                "user_id":
                    current_user["sub"]
            },

            {
                # Do not send full resume text
                # in history response
                "resume_text": 0
            }
        ).sort(
            "created_at",
            -1
        )
    )

    # --------------------------------------------------------
    # Convert ObjectIds
    # --------------------------------------------------------

    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )

    return {

        "success": True,

        "resumes":
            resumes
    }