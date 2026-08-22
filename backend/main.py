# ============================================================
# backend/main.py
# Resume Screening AI - Production-Oriented FastAPI Backend
# ============================================================

import os
import shutil
import tempfile
from datetime import datetime
from typing import Optional

from bson import ObjectId

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field

from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

MAX_FILE_SIZE_MB = int(
    os.getenv(
        "MAX_FILE_SIZE_MB",
        "10"
    )
)

MAX_FILE_SIZE = (
    MAX_FILE_SIZE_MB
    * 1024
    * 1024
)


# ============================================================
# INTERNAL IMPORTS
# ============================================================

# Resume parser
from utils.parser import extract_text


# ATS / NLP
from services.ats import (
    analyze_resume,
    calculate,
)


# Resume ↔ Job matching
from services.matcher import (
    calculate_match,
)


# Recommendations
from services.recommendation import (
    gen_recommendation,
)


# Chatbot
from services.chatbot import (
    ask_resume_bot,
)


# RAG
from services.rag import (
    store_resume_embeddings,
)


# Skills
from data.skills import SKILLS


# Database
from database.db import (
    candidates_collection,
    users_collection,
)


# Authentication
from auth.hashing import (
    hash_password,
    verify_password,
)

from auth.jwt_handler import (
    create_access_token,
)

from auth.dependencies import (
    get_current_user,
)


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="Resume Screening AI API",
    description=(
        "AI-powered resume screening, ATS analysis, "
        "job matching, recommendations and AI career assistant."
    ),
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)



# ============================================================
# ALLOWED FILE TYPES
# ============================================================

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
}


ALLOWED_MIME_TYPES = {
    "application/pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


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

    # Saved MongoDB resume
    resume_id: Optional[str] = None

    # Optional direct resume context
    resume_text: Optional[str] = None

    # User question
    question: str

    # Optional analysis context
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
        "message": "Resume Screening API Running",
        "version": "1.0.0",
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
    ),
):

    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No resume file provided.",
        )


    # --------------------------------------------------------
    # Validate extension
    # --------------------------------------------------------

    original_filename = file.filename

    extension = os.path.splitext(
        original_filename
    )[1].lower()


    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Only PDF and DOCX files are allowed."
            ),
        )


    # --------------------------------------------------------
    # Validate MIME type
    # --------------------------------------------------------

    if file.content_type not in ALLOWED_MIME_TYPES:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload a valid PDF or DOCX resume."
            ),
        )


    # --------------------------------------------------------
    # Safe filename
    # --------------------------------------------------------

    safe_filename = os.path.basename(
        original_filename
    )


    temporary_path = None


    try:

        # ====================================================
        # READ FILE WITH SIZE LIMIT
        # ====================================================

        file_bytes = await file.read(
            MAX_FILE_SIZE + 1
        )


        # ----------------------------------------------------
        # Check file size
        # ----------------------------------------------------

        if len(file_bytes) > MAX_FILE_SIZE:

            raise HTTPException(
                status_code=413,
                detail=(
                    f"File too large. "
                    f"Maximum allowed size is "
                    f"{MAX_FILE_SIZE_MB} MB."
                ),
            )


        # ----------------------------------------------------
        # Empty file
        # ----------------------------------------------------

        if not file_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )


        # ====================================================
        # CREATE TEMPORARY FILE
        # ====================================================

        suffix = extension


        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temporary_file:

            temporary_file.write(
                file_bytes
            )

            temporary_path = (
                temporary_file.name
            )


        # ====================================================
        # EXTRACT RESUME TEXT
        # ====================================================

        extracted_text = extract_text(
            temporary_path
        )


        if not extracted_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No readable text was found "
                    "in the uploaded resume."
                ),
            )


        # ====================================================
        # NLP / RESUME ANALYSIS
        # ====================================================

        resume_analysis = analyze_resume(
            extracted_text
        )


        # ====================================================
        # EXTRACT HARD SKILLS
        # ====================================================

        skills = resume_analysis.get(
            "hard_skills",
            []
        )


        # ====================================================
        # RESUME ↔ JOB MATCHING
        # ====================================================

        match_result = calculate_match(

            resume_text=extracted_text,

            jd_text=job_description,

            resume_skills=skills,

            skill_dictionary=SKILLS,
        )


        # ====================================================
        # ATS ANALYSIS
        # ====================================================

        ats_result = calculate(

            skills=skills,

            job_description=job_description,

            resume_text=extracted_text,
        )


        # ====================================================
        # RECOMMENDATIONS
        # ====================================================

        recommendations = gen_recommendation(

            resume_skill=skills,

            jd_text=job_description,

            resume_text=extracted_text,
        )



        # ====================================================
        # TIMESTAMP
        # ====================================================

        created_at = datetime.utcnow()


        # ====================================================
        # SAVE TO MONGODB
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

            # ------------------------------
            # Matching
            # ------------------------------

            "semantic_score":
                match_result.get(
                    "semantic_score",
                    0,
                ),

            "match_score":
                match_result.get(
                    "match_score",
                    0,
                ),

            "skill_score":
                match_result.get(
                    "skill_score",
                    0,
                ),

            "matched_skills":
                match_result.get(
                    "matched_skills",
                    [],
                ),

            "missing_skills":
                match_result.get(
                    "missing_skills",
                    [],
                ),

            "required_skills":
                match_result.get(
                    "required_skills",
                    [],
                ),

            # ------------------------------
            # ATS
            # ------------------------------

            "ats_score":
                ats_result.get(
                    "ats_score",
                    0,
                ),

            "ats_analysis":
                ats_result,

            # ------------------------------
            # Recommendations
            # ------------------------------

            "recommendations":
                recommendations,

            # ------------------------------
            # Job Description
            # ------------------------------

            "job_description":
                job_description,

            # ------------------------------
            # User ownership
            # ------------------------------

            "user_id":
                current_user["sub"],

            # ------------------------------
            # Timestamp
            # ------------------------------

            "created_at":
                created_at,
        }


        result = candidates_collection.insert_one(
            candidate_data
        )


        # ====================================================
        # RESUME ID
        # ====================================================

        resume_id = str(
            result.inserted_id
        )


        # ====================================================
        # STORE RAG EMBEDDINGS
        # ====================================================

        store_resume_embeddings(
            resume_text=extracted_text,
            resume_id=resume_id,
        )



        # ====================================================
        # API RESPONSE
        # ====================================================

        return {

            "success": True,

            "resume": {

                "id":
                    resume_id,

                "filename":
                    safe_filename,

                "preview":
                    extracted_text[:1500],
            },


            "analysis": {

                "hard_skills":
                    resume_analysis.get(
                        "hard_skills",
                        [],
                    ),

                "skills_by_category":
                    resume_analysis.get(
                        "skills_by_category",
                        {},
                    ),

                "soft_skills":
                    resume_analysis.get(
                        "soft_skills",
                        [],
                    ),

                "experience_years":
                    resume_analysis.get(
                        "experience_years",
                        0,
                    ),

                "education":
                    resume_analysis.get(
                        "education",
                        [],
                    ),

                "job_roles":
                    resume_analysis.get(
                        "job_roles",
                        [],
                    ),

                "contact":
                    resume_analysis.get(
                        "contact",
                        {},
                    ),

                "total_skills":
                    resume_analysis.get(
                        "total_skills",
                        0,
                    ),
            },


            "matching": {

                "match_score":
                    match_result.get(
                        "match_score",
                        0,
                    ),

                "semantic_score":
                    match_result.get(
                        "semantic_score",
                        0,
                    ),

                "skill_score":
                    match_result.get(
                        "skill_score",
                        0,
                    ),

                "matched_skills":
                    match_result.get(
                        "matched_skills",
                        [],
                    ),

                "missing_skills":
                    match_result.get(
                        "missing_skills",
                        [],
                    ),

                "required_skills":
                    match_result.get(
                        "required_skills",
                        [],
                    ),

                "has_job_description":
                    match_result.get(
                        "has_job_description",
                        False,
                    ),
            },


            "ats":
                ats_result,


            "recommendations":
                recommendations,
        }


    except HTTPException:

        raise


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


    except Exception as e:

        print(
            "Resume analysis error:",
            e,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "An unexpected error occurred "
                "while analyzing the resume."
            ),
        )


    finally:

        # ====================================================
        # GUARANTEED TEMP FILE CLEANUP
        # ====================================================

        if (
            temporary_path
            and os.path.exists(
                temporary_path
            )
        ):

            try:

                os.remove(
                    temporary_path
                )

            except Exception as cleanup_error:

                print(
                    "Temporary file cleanup error:",
                    cleanup_error,
                )


# ============================================================
# CHATBOT
# ============================================================

@app.post("/api/chat")
def chat_with_bot(

    data: ChatRequest,

    current_user: dict = Depends(
        get_current_user
    ),
):

    resume_text = data.resume_text

    analysis = data.analysis


    # --------------------------------------------------------
    # Validate question
    # --------------------------------------------------------

    if not data.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )


    # ========================================================
    # LOAD RESUME FROM DATABASE
    # ========================================================

    if data.resume_id:

        try:

            resume_object_id = ObjectId(
                data.resume_id
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid resume ID.",
            )


        resume = candidates_collection.find_one(

            {
                "_id":
                    resume_object_id,

                "user_id":
                    current_user["sub"],
            }
        )


        if not resume:

            raise HTTPException(
                status_code=404,
                detail="Resume not found.",
            )


        # ----------------------------------------------------
        # Resume text
        # ----------------------------------------------------

        resume_text = resume.get(
            "resume_text",
            "",
        )


        # ----------------------------------------------------
        # Saved analysis
        # ----------------------------------------------------

        if not analysis:

            analysis = resume.get(
                "resume_analysis",
                {},
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
            ),
        )


    # ========================================================
    # ASK AI
    # ========================================================

    try:

        answer = ask_resume_bot(

            resume_text=resume_text,

            question=data.question,

            analysis=analysis,

            resume_id=data.resume_id or "default",
        )



    except Exception as e:

        print(
            "Chatbot error:",
            e,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to generate chatbot response."
            ),
        )


    return {

        "success": True,

        "answer":
            answer,
    }


# ============================================================
# REGISTER
# ============================================================

@app.post("/register")
def register(
    user: UserRegister
):

    existing_user = users_collection.find_one(

        {
            "email":
                user.email,
        }
    )


    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="User already exists.",
        )


    hashed_password = hash_password(
        user.password
    )


    user_data = {

        "username":
            user.username,

        "email":
            user.email,

        "password":
            hashed_password,

        "created_at":
            datetime.utcnow(),
    }


    users_collection.insert_one(
        user_data
    )


    return {

        "success": True,

        "message":
            "User registered successfully.",
    }


# ============================================================
# LOGIN
# ============================================================

@app.post("/login")
def login(
    user: UserLogin
):

    db_user = users_collection.find_one(

        {
            "email":
                user.email,
        }
    )


    if not db_user:

        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )


    if not verify_password(

        user.password,

        db_user["password"]

    ):

        raise HTTPException(
            status_code=401,
            detail="Incorrect password.",
        )


    access_token = create_access_token(

        {
            "sub":
                str(
                    db_user["_id"]
                ),

            "email":
                db_user["email"],
        }
    )


    return {

        "success": True,

        "access_token":
            access_token,

        "token_type":
            "bearer",
    }


# ============================================================
# DASHBOARD STATS
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


    if not resumes:

        return {

            "success": True,

            "total_resumes": 0,

            "average_ats": 0,

            "average_match": 0,

            "best_match": 0,
        }


    ats_scores = [

        resume.get(
            "ats_score",
            0,
        )

        for resume in resumes
    ]


    match_scores = [

        resume.get(
            "match_score",
            resume.get(
                "semantic_score",
                0,
            ),
        )

        for resume in resumes
    ]


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
                2,
            ),

        "average_match":
            round(
                average_match,
                2,
            ),

        "best_match":
            round(
                best_match,
                2,
            ),
    }


# ============================================================
# USER RESUMES
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

                "created_at": 1,
            }

        ).sort(
            "created_at",
            -1,
        )
    )


    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )


    return {

        "success": True,

        "resumes":
            resumes,
    }


# ============================================================
# SINGLE RESUME
# ============================================================

@app.get("/resume/{resume_id}")
def get_resume(

    resume_id: str,

    current_user: dict = Depends(
        get_current_user
    )
):

    try:

        object_id = ObjectId(
            resume_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid resume ID.",
        )


    resume = candidates_collection.find_one(

        {
            "_id":
                object_id,

            "user_id":
                current_user["sub"],
        }
    )


    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )


    resume["_id"] = str(
        resume["_id"]
    )


    return {

        "success": True,

        "resume":
            resume,
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

    try:

        object_id = ObjectId(
            resume_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid resume ID.",
        )


    result = candidates_collection.delete_one(

        {
            "_id":
                object_id,

            "user_id":
                current_user["sub"],
        }
    )


    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )


    return {

        "success": True,

        "message":
            "Resume deleted successfully.",
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
                "resume_text": 0,
            }

        ).sort(
            "created_at",
            -1,
        )
    )


    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )


    return {

        "success": True,

        "resumes":
            resumes,
    }