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

# Resume parsing
from utils.parser import extract_text

# NLP / ATS
from services.ats import (
    analyze_resume,
    calculate
)

# Resume-JD matching
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
    store_resume_embeddings
)

# Skills dictionary
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
        "job matching and career assistant API."
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# DIRECTORIES
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

    # Can use an existing saved resume
    resume_id: Optional[str] = None

    # Or send resume directly
    resume_text: Optional[str] = None

    question: str

    # Parsed ATS/NLP analysis
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
# RESUME ANALYSIS
# ============================================================

@app.post("/api/analyze")
async def analyze_resume_endpoint(

    file: UploadFile = File(...),

    # Job description is optional
    job_description: str = Form(""),

    current_user: dict = Depends(
        get_current_user
    )
):

    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file provided."
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
                "Only PDF and DOCX files are allowed."
            )
        )

    # --------------------------------------------------------
    # Prevent unsafe filenames
    # --------------------------------------------------------

    safe_filename = os.path.basename(
        original_filename
    )

    file_location = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )

    try:

        # ----------------------------------------------------
        # Save uploaded file
        # ----------------------------------------------------

        with open(
            file_location,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # ----------------------------------------------------
        # Extract resume text
        # ----------------------------------------------------

        extracted_text = extract_text(
            file_location
        )

        if not extracted_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unable to extract readable text "
                    "from the resume."
                )
            )

        # ----------------------------------------------------
        # NLP / Resume Analysis
        # ----------------------------------------------------

        resume_analysis = analyze_resume(
            extracted_text
        )

        # ----------------------------------------------------
        # Extract hard skills
        # ----------------------------------------------------

        skills = resume_analysis.get(
            "hard_skills",
            []
        )

        # ----------------------------------------------------
        # Store RAG embeddings
        # ----------------------------------------------------

        store_resume_embeddings(
            extracted_text
        )

        # ----------------------------------------------------
        # Semantic + Skill Matching
        # ----------------------------------------------------

        match_result = calculate_match(

            resume_text=extracted_text,

            jd_text=job_description,

            resume_skills=skills,

            skill_dictionary=SKILLS
        )

        # ----------------------------------------------------
        # ATS Analysis
        # ----------------------------------------------------

        ats_result = calculate(

            skills,

            job_description
        )

        # ----------------------------------------------------
        # Recommendations
        # ----------------------------------------------------

        recommendations = gen_recommendation(

            resume_skill=skills,

            jd_text=job_description,

            resume_text=extracted_text
        )

        # ----------------------------------------------------
        # Current timestamp
        # ----------------------------------------------------

        created_at = datetime.utcnow()

        # ----------------------------------------------------
        # Save complete candidate analysis
        # ----------------------------------------------------

        candidate_data = {

            "filename": safe_filename,

            "resume_text": extracted_text,

            "skills": skills,

            "resume_analysis": resume_analysis,

            # Semantic score
            "semantic_score": match_result.get(
                "semantic_score",
                0
            ),

            # Combined match score
            "match_score": match_result.get(
                "match_score",
                0
            ),

            # Skill match
            "skill_score": match_result.get(
                "skill_score",
                0
            ),

            "matched_skills": match_result.get(
                "matched_skills",
                []
            ),

            "missing_skills": match_result.get(
                "missing_skills",
                []
            ),

            # ATS
            "ats_score": ats_result.get(
                "ats_score",
                0
            ),

            "ats_analysis": ats_result,

            # Recommendations
            "recommendations": recommendations,

            # Job description
            "job_description": job_description,

            # User
            "user_id": current_user["sub"],

            # Timestamp
            "created_at": created_at
        }

        # ----------------------------------------------------
        # Insert into MongoDB
        # ----------------------------------------------------

        result = candidates_collection.insert_one(
            candidate_data
        )

        resume_id = str(
            result.inserted_id
        )

        # ----------------------------------------------------
        # Final API Response
        # ----------------------------------------------------

        return {

            "success": True,

            "resume": {

                "id": resume_id,

                "filename": safe_filename,

                "preview": extracted_text[:1500]
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

                "has_job_description":
                    match_result.get(
                        "has_job_description",
                        False
                    )
            },

            "ats": ats_result,

            "recommendations":
                recommendations
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except HTTPException:

        raise

    except Exception as e:

        print(
            f"Resume analysis error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "An error occurred while "
                "analyzing the resume."
            )
        )

    finally:

        # ----------------------------------------------------
        # Always delete temporary upload
        # ----------------------------------------------------

        if os.path.exists(
            file_location
        ):

            os.remove(
                file_location
            )


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
    # If resume_id is provided, retrieve resume from MongoDB
    # --------------------------------------------------------

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
                "_id": resume_object_id,

                "user_id":
                    current_user["sub"]
            }
        )

        if not resume:

            raise HTTPException(
                status_code=404,
                detail="Resume not found."
            )

        resume_text = resume.get(
            "resume_text",
            ""
        )

        # Use saved analysis if frontend
        # did not send it
        if not analysis:

            analysis = resume.get(
                "resume_analysis",
                {}
            )

    # --------------------------------------------------------
    # Validate resume
    # --------------------------------------------------------

    if not resume_text:

        raise HTTPException(
            status_code=400,
            detail=(
                "Resume context is required. "
                "Provide resume_id or resume_text."
            )
        )

    # --------------------------------------------------------
    # Validate question
    # --------------------------------------------------------

    if not data.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    # --------------------------------------------------------
    # Ask AI assistant
    # --------------------------------------------------------

    try:

        answer = ask_resume_bot(

            resume_text=resume_text,

            question=data.question,

            analysis=analysis
        )

    except Exception as e:

        print(
            f"Chatbot error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate chatbot response."
            )
        )

    return {

        "success": True,

        "answer": answer
    }


# ============================================================
# REGISTER
# ============================================================

@app.post("/register")
def register(
    user: UserRegister
):

    # --------------------------------------------------------
    # Check existing account
    # --------------------------------------------------------

    existing_user = users_collection.find_one(
        {
            "email": user.email
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

        "username": user.username,

        "email": user.email,

        "password": hashed_password,

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
            "email": user.email
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
    # Generate JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        {
            "sub": str(
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
        / len(ats_scores)
    )

    average_match = (
        sum(match_scores)
        / len(match_scores)
    )

    best_match = max(
        match_scores
    )

    return {

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
        )

    )

    # --------------------------------------------------------
    # Convert MongoDB ObjectId
    # --------------------------------------------------------

    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )

    return {

        "success": True,

        "resumes": resumes
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
    # Validate ObjectId
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
    # Find resume belonging to user
    # --------------------------------------------------------

    resume = candidates_collection.find_one(

        {
            "_id": object_id,

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
    # Convert ObjectId to string
    # --------------------------------------------------------

    resume["_id"] = str(
        resume["_id"]
    )

    return {

        "success": True,

        "resume": resume
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
    # Validate ObjectId
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
    # Delete only user's own resume
    # --------------------------------------------------------

    result = candidates_collection.delete_one(

        {
            "_id": object_id,

            "user_id":
                current_user["sub"]
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
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

        "resumes": resumes
    }