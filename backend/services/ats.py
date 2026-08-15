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
    Normalize text for NLP processing.
    """

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ============================================================
# REGEX MATCHING
# ============================================================

def find_matches(
    text: str,
    items: list
) -> list:
    """
    Find dictionary items inside text.
    """

    if not text:
        return []

    found = []

    for item in items:

        pattern = (
            r"(?<!\w)"
            + re.escape(
                item.lower()
            )
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            text
        ):

            found.append(
                item
            )

    return found


# ============================================================
# HARD SKILLS
# ============================================================

def extract_hard_skills(
    text: str
) -> dict:

    normalized = normalize_text(
        text
    )

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

def extract_soft_skills(
    text: str
) -> list:

    normalized = normalize_text(
        text
    )

    return find_matches(
        normalized,
        SOFT_SKILLS
    )


# ============================================================
# EMAIL
# ============================================================

def extract_email(
    text: str
):

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
# PHONE
# ============================================================

def extract_phone(
    text: str
):

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

def extract_linkedin(
    text: str
):

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

def extract_github(
    text: str
):

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

def extract_education(
    text: str
) -> list:

    normalized = normalize_text(
        text
    )

    return find_matches(
        normalized,
        EDUCATION_KEYWORDS
    )


# ============================================================
# JOB ROLES
# ============================================================

def extract_job_roles(
    text: str
) -> list:

    normalized = normalize_text(
        text
    )

    return find_matches(
        normalized,
        JOB_ROLES
    )


# ============================================================
# EXPERIENCE
# ============================================================

def extract_experience_years(
    text: str
):

    patterns = [

        r"(\d+(?:\.\d+)?)\+?\s*"
        r"(?:years?|yrs?)"
        r"\s*(?:of\s*)?"
        r"(?:professional\s*)?"
        r"experience",

        r"experience\s*[:\-]?\s*"
        r"(\d+(?:\.\d+)?)\+?\s*"
        r"(?:years?|yrs?)"
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

            except (
                ValueError,
                TypeError
            ):

                pass

    if not values:

        return 0

    return max(
        values
    )


# ============================================================
# CONTACT DETAILS
# ============================================================

def extract_contact_details(
    text: str
) -> dict:

    return {

        "email":
            extract_email(text),

        "phone":
            extract_phone(text),

        "linkedin":
            extract_linkedin(text),

        "github":
            extract_github(text)
    }


# ============================================================
# SECTION DETECTION
# ============================================================

def detect_sections(
    text: str
) -> dict:
    """
    Detect common resume sections.
    """

    normalized = normalize_text(
        text
    )

    sections = {

        "summary": [
            "summary",
            "professional summary",
            "profile",
            "objective"
        ],

        "experience": [
            "experience",
            "work experience",
            "professional experience",
            "employment"
        ],

        "education": [
            "education",
            "academic background",
            "qualifications"
        ],

        "skills": [
            "skills",
            "technical skills",
            "core skills",
            "technologies"
        ],

        "projects": [
            "projects",
            "personal projects",
            "academic projects"
        ],

        "certifications": [
            "certifications",
            "certificates"
        ]
    }

    detected = {}

    for section, keywords in sections.items():

        detected[section] = any(
            keyword in normalized
            for keyword in keywords
        )

    return detected


# ============================================================
# FORMAT SCORE
# ============================================================

def calculate_format_score(
    text: str
) -> float:
    """
    Estimate resume formatting/readability quality.

    This is not a visual PDF parser. It evaluates
    extracted text structure.
    """

    if not text:

        return 0

    score = 0

    sections = detect_sections(
        text
    )

    # Useful resume sections
    important_sections = [
        "summary",
        "experience",
        "education",
        "skills",
        "projects"
    ]

    section_count = sum(
        sections.get(section, False)
        for section in important_sections
    )

    score += min(
        section_count * 12,
        60
    )

    # Reasonable text length
    word_count = len(
        text.split()
    )

    if 150 <= word_count <= 1500:

        score += 20

    elif 80 <= word_count < 150:

        score += 10

    # Contact information
    contact = extract_contact_details(
        text
    )

    if contact["email"]:
        score += 5

    if contact["phone"]:
        score += 5

    if contact["linkedin"] or contact["github"]:
        score += 5

    # Avoid extremely long lines / obvious extraction problems
    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    if lines:

        long_lines = sum(
            len(line) > 250
            for line in lines
        )

        if long_lines == 0:

            score += 5

    return round(
        min(score, 100),
        2
    )


# ============================================================
# EXPERIENCE SCORE
# ============================================================

def calculate_experience_score(
    text: str
) -> float:
    """
    Estimate experience section completeness.
    """

    if not text:

        return 0

    sections = detect_sections(
        text
    )

    score = 0

    if sections["experience"]:

        score += 50

    experience_years = extract_experience_years(
        text
    )

    if experience_years > 0:

        score += 30

    # Strong achievement indicators
    achievement_words = [
        "developed",
        "built",
        "implemented",
        "designed",
        "optimized",
        "automated",
        "improved",
        "increased",
        "reduced",
        "deployed"
    ]

    normalized = normalize_text(
        text
    )

    action_count = sum(
        word in normalized
        for word in achievement_words
    )

    score += min(
        action_count * 5,
        20
    )

    return round(
        min(score, 100),
        2
    )


# ============================================================
# COMPLETENESS SCORE
# ============================================================

def calculate_completeness_score(
    text: str
) -> float:
    """
    Estimate how complete the resume is.
    """

    if not text:

        return 0

    score = 0

    contact = extract_contact_details(
        text
    )

    if contact["email"]:
        score += 15

    if contact["phone"]:
        score += 10

    if contact["linkedin"]:
        score += 5

    if contact["github"]:
        score += 5

    sections = detect_sections(
        text
    )

    if sections["summary"]:
        score += 10

    if sections["experience"]:
        score += 20

    if sections["education"]:
        score += 15

    if sections["skills"]:
        score += 10

    if sections["projects"]:
        score += 10

    return round(
        min(score, 100),
        2
    )


# ============================================================
# COMPLETE RESUME NLP ANALYSIS
# ============================================================

def analyze_resume(
    text: str
) -> dict:

    hard_skills = extract_hard_skills(
        text
    )

    soft_skills = extract_soft_skills(
        text
    )

    education = extract_education(
        text
    )

    job_roles = extract_job_roles(
        text
    )

    experience_years = extract_experience_years(
        text
    )

    contact = extract_contact_details(
        text
    )

    sections = detect_sections(
        text
    )

    # Flatten hard skills
    all_hard_skills = []

    for skills in hard_skills.values():

        all_hard_skills.extend(
            skills
        )

    all_hard_skills = list(
        dict.fromkeys(
            all_hard_skills
        )
    )

    return {

        "hard_skills":
            all_hard_skills,

        "skills_by_category":
            hard_skills,

        "soft_skills":
            soft_skills,

        "experience_years":
            experience_years,

        "education":
            education,

        "job_roles":
            job_roles,

        "contact":
            contact,

        "sections":
            sections,

        "total_skills":
            len(all_hard_skills)
    }


# ============================================================
# ATS SCORE
# ============================================================

def calculate(
    skills,
    job_description: str = "",
    resume_text: str = ""
) -> dict:
    """
    Calculate ATS score.

    With JD:
        Keyword matching + completeness +
        formatting + experience.

    Without JD:
        Completeness + formatting +
        experience.
    """

    # --------------------------------------------------------
    # Base resume scores
    # --------------------------------------------------------

    format_score = calculate_format_score(
        resume_text
    )

    experience_score = calculate_experience_score(
        resume_text
    )

    completeness_score = calculate_completeness_score(
        resume_text
    )

    # --------------------------------------------------------
    # No Job Description
    # --------------------------------------------------------

    if not job_description or not job_description.strip():

        ats_score = (
            completeness_score * 0.40
            +
            format_score * 0.35
            +
            experience_score * 0.25
        )

        return {

            "ats_score":
                round(
                    ats_score,
                    2
                ),

            "keyword_score": 0,

            "format_score":
                format_score,

            "experience_score":
                experience_score,

            "completeness_score":
                completeness_score,

            "matched_skills": [],

            "missing_skills": [],

            "required_skills": [],

            "has_job_description": False
        }

    # --------------------------------------------------------
    # Job Description Analysis
    # --------------------------------------------------------

    jd_text = normalize_text(
        job_description
    )

    resume_skills = {
        skill.lower()
        for skill in skills
    }

    # --------------------------------------------------------
    # Extract JD skills
    # --------------------------------------------------------

    jd_skills = []

    for category in HARD_SKILLS.values():

        jd_skills.extend(
            find_matches(
                jd_text,
                category
            )
        )

    jd_skills = list(
        dict.fromkeys(
            jd_skills
        )
    )

    # --------------------------------------------------------
    # Matched skills
    # --------------------------------------------------------

    matched_skills = []

    for skill in jd_skills:

        if skill.lower() in resume_skills:

            matched_skills.append(
                skill
            )

    # --------------------------------------------------------
    # Missing skills
    # --------------------------------------------------------

    missing_skills = [

        skill

        for skill in jd_skills

        if skill.lower()
        not in resume_skills
    ]

    # --------------------------------------------------------
    # Keyword score
    # --------------------------------------------------------

    if jd_skills:

        keyword_score = (

            len(matched_skills)
            /
            len(jd_skills)

        ) * 100

    else:

        keyword_score = 0

    keyword_score = round(
        keyword_score,
        2
    )

    # --------------------------------------------------------
    # Final ATS score
    # --------------------------------------------------------

    if jd_skills:

        ats_score = (

            keyword_score * 0.55

            +

            completeness_score * 0.20

            +

            format_score * 0.15

            +

            experience_score * 0.10
        )

    else:

        # JD exists but no recognizable
        # technical skills were detected.
        ats_score = (

            completeness_score * 0.40

            +

            format_score * 0.35

            +

            experience_score * 0.25
        )

    return {

        "ats_score":
            round(
                ats_score,
                2
            ),

        "keyword_score":
            keyword_score,

        "format_score":
            format_score,

        "experience_score":
            experience_score,

        "completeness_score":
            completeness_score,

        "matched_skills":
            matched_skills,

        "missing_skills":
            missing_skills,

        "required_skills":
            jd_skills,

        "has_job_description":
            True
    }