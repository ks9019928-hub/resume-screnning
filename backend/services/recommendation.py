def gen_recommendation(resume_skill,jd_text):
    jd_text=jd_text.lower()
    recommendations=[]
    skills_tips={
        "aws": "Learn cloud deployment using AWS",
        "docker": "Add Docker containerization skills",
        "kubernetes": "Understand container orchestration",
        "machine learning": "Build ML projects using scikit-learn",
        "nlp": "Explore NLP using transformers and spaCy",
        "react": "Create frontend projects using React",
        "sql": "Strengthen database querying skills",
        "fastapi": "Build scalable APIs using FastAPI"
    }
    for skill, recommendations in skills_tips.items():
        if skill in jd_text and skill not in resume_skill:
            recommendations.append(recommendations)
    if len(recommendations)==0:
        recommendations.append(
            "Your resume aligns well with this job description"
        )
    return recommendations