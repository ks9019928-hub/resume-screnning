from fastapi import FastAPI,UploadFile,File
import shutil
from utils.parser import extract_text
import os
from utils.parser import extract_text, extract_skill
from pydantic import BaseModel
from services.matcher import match_resume_to_jd
from database.db import candidates_collection
from services.ats import calculate
from services.recommendation import gen_recommendation
from services.chatbot import ask_resume_bot
from fastapi import Form
from fastapi.middleware.cors import CORSMiddleware
from services.rag import store_resume_embeddings
from auth.hashing import hash_password
from database.db import users_collection

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JDRequest(BaseModel):
    resume_text: str
    job_description: str

class ChatRequest(BaseModel):
    resume_text: str
    question: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
@app.get("/")
def home():
    return {"message": "Resume Screening API Running"}

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_location=f"uploads/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        extracted_text = extract_text(file_location)
        skills = extract_skill(extracted_text)
        candidate_data = {
        "filename": file.filename,
        "skills": skills,
        "resume_preview": extracted_text[:1000]
    }

        candidates_collection.insert_one(candidate_data)
        os.remove(file_location)

    return {
        "filename": file.filename,
        "skills": skills,
        "extracted_text": extracted_text[:1000]
        }

@app.post("/match")
def match_resume(data: JDRequest):

    score = match_resume_to_jd(
        data.resume_text,
        data.job_description
    )

    return {
        "match_score": score
    }
@app.post("/ats-score")
def ats_score(data: JDRequest):

    skills = extract_skill(data.resume_text)

    result = calculate(
        skills,
        data.job_description
    )

    return result

@app.post("/recommend")
def recommend(data: JDRequest):

    skills = extract_skill(data.resume_text)

    recommendations = gen_recommendation(
        skills,
        data.job_description
    )

    return {
        "skills": skills,
        "recommendations": recommendations
    }

@app.post("/chat")
def chat_with_bot(data: ChatRequest):

    answer = ask_resume_bot(
        data.resume_text,
        data.question
    )

    return {
        "answer": answer
    }
@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text(file_location)
    store_resume_embeddings(extracted_text)

    skills = extract_skill(extracted_text)

    semantic_score = match_resume_to_jd(
        extracted_text,
        job_description
    )

    ats_result = calculate(
        skills,
        job_description
    )

    recommendations = gen_recommendation(
        skills,
        job_description
    )

    candidate_data = {
        "filename": file.filename,
        "skills": skills,
        "semantic_score": semantic_score,
        "ats_score": ats_result["ats_score"]
    }

    candidates_collection.insert_one(candidate_data)

    os.remove(file_location)

    return {
        "filename": file.filename,
        "skills": skills,
        "semantic_match": semantic_score,
        "ats_analysis": ats_result,
        "recommendations": recommendations,
        "resume_preview": extracted_text[:1000]
    }
@app.post("/register")
def register(user: UserRegister):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "User already exists"
        }

    hashed_password = hash_password(
        user.password
    )

    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }

    users_collection.insert_one(user_data)

    return {
        "message": "User registered successfully"
    }