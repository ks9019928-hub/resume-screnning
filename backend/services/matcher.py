# ============================================================
# backend/services/matcher.py
# Resume ↔ Job Description Matching Engine
# ============================================================

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

import re


# ============================================================
# LOAD EMBEDDING MODEL
# ============================================================

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> str:
    """
    Normalize text before matching.
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
# SEMANTIC MATCHING
# ============================================================

def match_resume_to_jd(
    resume_text: str,
    jd_text: str
) -> float:
    """
    Calculate semantic similarity between
    resume and job description.

    Returns:
        Score between 0 and 100.
    """

    # --------------------------------------------------------
    # Missing JD
    # --------------------------------------------------------

    if not jd_text or not jd_text.strip():

        return 0.0

    # --------------------------------------------------------
    # Missing resume
    # --------------------------------------------------------

    if not resume_text or not resume_text.strip():

        return 0.0

    resume_text = normalize_text(
        resume_text
    )

    jd_text = normalize_text(
        jd_text
    )

    # --------------------------------------------------------
    # Generate embeddings
    # --------------------------------------------------------

    embeddings = model.encode(
        [
            resume_text,
            jd_text
        ]
    )

    # --------------------------------------------------------
    # Cosine similarity
    # --------------------------------------------------------

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    # Sentence-transformer cosine similarity
    # normally lies between -1 and 1.
    # Clamp to a usable 0-100 range.
    similarity = max(
        0.0,
        min(float(similarity), 1.0)
    )

    score = similarity * 100

    return round(
        score,
        2
    )


# ============================================================
# SKILL MATCHING
# ============================================================

def calculate_skill_match(
    resume_skills: list,
    jd_text: str,
    skill_dictionary: list
) -> dict:
    """
    Compare resume skills against skills
    mentioned in the job description.
    """

    if not jd_text or not jd_text.strip():

        return {
            "score": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "required_skills": []
        }

    if not skill_dictionary:

        return {
            "score": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "required_skills": []
        }

    jd_text_normalized = normalize_text(
        jd_text
    )

    resume_skill_set = {
        normalize_text(skill)
        for skill in (resume_skills or [])
    }

    required_skills = []

    # --------------------------------------------------------
    # Detect skills in JD
    # --------------------------------------------------------

    for skill in skill_dictionary:

        skill_normalized = normalize_text(
            skill
        )

        # Word-boundary matching prevents:
        #
        # Java -> incorrectly matching JavaScript
        #
        pattern = (
            r"(?<!\w)"
            + re.escape(skill_normalized)
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            jd_text_normalized
        ):

            required_skills.append(
                skill
            )

    # Remove duplicate aliases
    required_skills = list(
        dict.fromkeys(
            required_skills
        )
    )

    # --------------------------------------------------------
    # No recognizable skills in JD
    # --------------------------------------------------------

    if not required_skills:

        return {
            "score": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "required_skills": []
        }

    # --------------------------------------------------------
    # Find matched skills
    # --------------------------------------------------------

    matched_skills = []

    missing_skills = []

    for skill in required_skills:

        normalized_skill = normalize_text(
            skill
        )

        if normalized_skill in resume_skill_set:

            matched_skills.append(
                skill
            )

        else:

            missing_skills.append(
                skill
            )

    # --------------------------------------------------------
    # Calculate skill score
    # --------------------------------------------------------

    score = (
        len(matched_skills)
        /
        len(required_skills)
    ) * 100

    return {

        "score": round(
            score,
            2
        ),

        "matched_skills":
            matched_skills,

        "missing_skills":
            missing_skills,

        "required_skills":
            required_skills
    }


# ============================================================
# COMPLETE MATCHING ENGINE
# ============================================================

def calculate_match(
    resume_text: str,
    jd_text: str,
    resume_skills: list = None,
    skill_dictionary: list = None
) -> dict:
    """
    Calculate complete resume-JD matching.

    Final score:

        70% Semantic Similarity
        30% Skill Match

    If no JD is supplied, matching is skipped.
    ATS scoring is handled separately by ats.py.
    """

    # --------------------------------------------------------
    # No Job Description
    # --------------------------------------------------------

    if not jd_text or not jd_text.strip():

        return {

            "match_score": 0,

            "semantic_score": 0,

            "skill_score": 0,

            "matched_skills": [],

            "missing_skills": [],

            "required_skills": [],

            "has_job_description": False
        }

    # --------------------------------------------------------
    # Semantic score
    # --------------------------------------------------------

    semantic_score = match_resume_to_jd(
        resume_text,
        jd_text
    )

    # --------------------------------------------------------
    # Skill score
    # --------------------------------------------------------

    skill_result = calculate_skill_match(

        resume_skills or [],

        jd_text,

        skill_dictionary or []
    )

    skill_score = skill_result[
        "score"
    ]

    # --------------------------------------------------------
    # Combined score
    # --------------------------------------------------------

    final_score = (

        semantic_score * 0.70

        +

        skill_score * 0.30
    )

    return {

        "match_score": round(
            final_score,
            2
        ),

        "semantic_score":
            semantic_score,

        "skill_score":
            skill_score,

        "matched_skills":
            skill_result[
                "matched_skills"
            ],

        "missing_skills":
            skill_result[
                "missing_skills"
            ],

        "required_skills":
            skill_result[
                "required_skills"
            ],

        "has_job_description":
            True
    }