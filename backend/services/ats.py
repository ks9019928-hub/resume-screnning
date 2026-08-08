import re

from data.skills import (
    HARD_SKILLS,
    SOFT_SKILLS,
    EDUCATION_KEYWORDS,
    JOB_ROLES
)


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> str:
    """
    Normalize resume text for NLP processing.
    """

    if not text:
        return ""

    text = text.lower()

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ============================================================
# REGEX SKILL MATCHING
# ============================================================

def find_matches(text: str, items: list) -> list:
    """
    Find dictionary items inside resume text.
    Uses word boundaries to reduce false positives.
    """

    found = []

    for item in items:

        pattern = (
            r"(?<!\w)"
            + re.escape(item.lower())
            + r"(?!\w)"
        )

        if re.search(pattern, text):
            found.append(item)

    return found


# ============================================================
# HARD SKILLS
# ============================================================

def extract_hard_skills(text: str) -> dict:
    """
    Extract technical skills grouped by category.
    """

    normalized = normalize_text(text)

    result = {}

    for category, skills in HARD_SKILLS.items():

        matches = find_matches(
            normalized,
            skills
        )

        if matches:
            result[category] = matches

    return result


# ============================================================
# SOFT SKILLS
# ============================================================

def extract_soft_skills(text: str) -> list:
    """
    Extract soft skills from resume.
    """

    normalized = normalize_text(text)

    return find_matches(
        normalized,
        SOFT_SKILLS
    )


# ============================================================
# EMAIL
# ============================================================

def extract_email(text: str):
    """
    Extract email address.
    """

    pattern = r"""
        [a-zA-Z0-9._%+-]+
        @
        [a-zA-Z0-9.-]+
        \.
        [a-zA-Z]{2,}
    """

    match = re.search(
        pattern,
        text,
        re.VERBOSE
    )

    if match:
        return match.group(0)

    return None


# ============================================================
# PHONE NUMBER
# ============================================================

def extract_phone(text: str):
    """
    Extract common phone number formats.
    """

    patterns = [

        r"\+91[\s-]?[6-9]\d{9}",

        r"\+?[0-9]{1,3}[\s-]?[6-9]\d{9}",

        r"\b[6-9]\d{9}\b"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text
        )

        if match:
            return match.group(0)

    return None


# ============================================================
# LINKEDIN
# ============================================================

def extract_linkedin(text: str):
    """
    Extract LinkedIn profile URL.
    """

    pattern = (
        r"(https?://)?"
        r"(www\.)?"
        r"linkedin\.com/in/"
        r"[a-zA-Z0-9_-]+"
    )

    match = re.search(
        pattern,
        text,
        re.IGNORECASE
    )

    if match:
        return match.group(0)

    return None


# ============================================================
# GITHUB
# ============================================================

def extract_github(text: str):
    """
    Extract GitHub profile URL.
    """

    pattern = (
        r"(https?://)?"
        r"(www\.)?"
        r"github\.com/"
        r"[a-zA-Z0-9_-]+"
    )

    match = re.search(
        pattern,
        text,
        re.IGNORECASE
    )

    if match:
        return match.group(0)

    return None


# ============================================================
# EDUCATION
# ============================================================

def extract_education(text: str) -> list:
    """
    Detect education qualifications.
    """

    normalized = normalize_text(text)

    return find_matches(
        normalized,
        EDUCATION_KEYWORDS
    )


# ============================================================
# JOB ROLES
# ============================================================

def extract_job_roles(text: str) -> list:
    """
    Detect common job titles.
    """

    normalized = normalize_text(text)

    return find_matches(
        normalized,
        JOB_ROLES
    )


# ============================================================
# EXPERIENCE YEARS
# ============================================================

def extract_experience_years(text: str):
    """
    Extract explicit years of experience.

    Examples:
        2 years experience
        3+ years of experience
        1.5 years experience
        5 yrs experience
    """

    patterns = [

        r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)"
        r"\s*(?:of\s*)?(?:professional\s*)?"
        r"experience",

        r"experience\s*[:\-]?\s*"
        r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)"
    ]

    values = []

    for pattern in patterns:

        matches = re.findall(
            pattern,
            text,
            re.IGNORECASE
        )

        for match in matches:

            try:
                values.append(
                    float(match)
                )

            except ValueError:
                pass

    if not values:
        return 0

    return max(values)


# ============================================================
# CONTACT DETAILS
# ============================================================

def extract_contact_details(text: str) -> dict:
    """
    Extract contact information.
    """

    return {

        "email": extract_email(text),

        "phone": extract_phone(text),

        "linkedin": extract_linkedin(text),

        "github": extract_github(text)
    }


# ============================================================
# COMPLETE RESUME NLP ANALYSIS
# ============================================================

def analyze_resume(text: str) -> dict:
    """
    Run complete NLP analysis on a resume.
    """

    hard_skills = extract_hard_skills(text)

    soft_skills = extract_soft_skills(text)

    education = extract_education(text)

    job_roles = extract_job_roles(text)

    experience_years = extract_experience_years(text)

    contact = extract_contact_details(text)

    # Flatten hard skills
    all_hard_skills = []

    for skills in hard_skills.values():
        all_hard_skills.extend(skills)

    return {

        "hard_skills": all_hard_skills,

        "skills_by_category": hard_skills,

        "soft_skills": soft_skills,

        "experience_years": experience_years,

        "education": education,

        "job_roles": job_roles,

        "contact": contact,

        "total_skills": len(all_hard_skills)
    }


# ============================================================
# ATS SCORE
# ============================================================

def calculate(
    skills,
    job_description: str
) -> dict:
    """
    Calculate ATS score against a job description.

    Returns:
        ATS score
        matched skills
        missing skills
        keyword score
    """

    if not job_description:

        return {

            "ats_score": 0,

            "keyword_score": 0,

            "matched_skills": [],

            "missing_skills": []
        }

    jd_text = normalize_text(
        job_description
    )

    resume_skills = [
        skill.lower()
        for skill in skills
    ]

    matched_skills = []

    for skill in skills:

        pattern = (
            r"(?<!\w)"
            + re.escape(skill.lower())
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            jd_text
        ):

            matched_skills.append(skill)

    # Extract technical skills from JD
    jd_skills = []

    for category in HARD_SKILLS.values():

        jd_skills.extend(
            find_matches(
                jd_text,
                category
            )
        )

    # Remove duplicates
    jd_skills = list(
        dict.fromkeys(jd_skills)
    )

    missing_skills = [

        skill

        for skill in jd_skills

        if skill.lower()
        not in resume_skills
    ]

    if jd_skills:

        keyword_score = (
            len(matched_skills)
            / len(jd_skills)
        ) * 100

    else:

        keyword_score = 0

    return {

        "ats_score": round(
            keyword_score,
            2
        ),

        "keyword_score": round(
            keyword_score,
            2
        ),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "required_skills": jd_skills
    }