def calculate(resume_skill,jd_text):
    jd_text=jd.lower()
    required_skills=[]
    comman_skills=[
         "python",
        "java",
        "sql",
        "react",
        "aws",
        "docker",
        "machine learning",
        "nlp",
        "mongodb",
        "fastapi"
    ]
    for skills in comman_skills:
        if skills in jd_text:
            required_skills.append(skills)
    matched_skills=[]
    missing_skills=[]
    for skills in required_skills:
        if skills in resume_skill:
            matched_skills.append(skills)
        else:
            missing_skills.append(skills)
    if len(required_skills) == 0:
        score = 50
    else:
        score = int((len(matched_skills) / len(required_skills)) * 100)

    recommendations = []

    if missing_skills:
        recommendations.append(
            f"Consider adding these skills: {', '.join(missing_skills)}"
        )

    if score < 60:
        recommendations.append(
            "Resume has low ATS match for this role"
        )
        if score >= 80:
         recommendations.append(
            "Strong ATS alignment detected"
        )

    return {
        "ats_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendations": recommendations
    }