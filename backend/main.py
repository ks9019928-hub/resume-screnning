from fastapi import FastAPI,UploadFile,File
import shutil
from utils.parser import extract_text
import os

app=FastAPI()

@app.get("/")
def home():
    return {"message": "Resume Screening API Running"}

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_location=f"uploads/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        extracted_text = extract_text(file_location)
        os.remove(file_location)

    return {
        "filename": file.filename,
        "extracted_text": extracted_text[:1000]
        }