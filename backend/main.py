from fastapi import FastAPI,UploadFile,File
import shutil
from utils.parser import extract_text
import os
from utils.parser import extract_text_from_pdf, extract_skills
from pydantic import BaseModel
from services.matcher import match_resume_to_jd
from backend.db import candidates_collection
from backend.services.ats import calculate

app=FastAPI()

class JDRequest(BaseModel):
    resume_text: str
    job_description: str

@app.get("/")
def home():
    return {"message": "Resume Screening API Running"}

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_location=f"uploads/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        extracted_text = extract_text(file_location)
        skills = extract_skills(extracted_text)
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

    skills = extract_skills(data.resume_text)

    result = calculate(
        skills,
        data.job_description
    )

    return result