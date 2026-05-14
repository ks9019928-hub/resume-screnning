import pdfplumber
from data.skills import SKILLS

def extract_text(pdf_path):
    text=""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            extracted=page.extract_text()
            if extracted:
                text+=extracted+"\n"
    return text

def extract_skill(text):
    found_skills=[]
    text=text.lower()
    for skill in SKILLS:
        if skill.lower in text:
            found_skills.append(skill)
    return found_skills