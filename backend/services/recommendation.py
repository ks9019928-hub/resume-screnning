import re

from data.skills import (
    HARD_SKILLS,
    SOFT_SKILLS,
    JOB_ROLES
)


# ============================================================
# SKILL TIPS
# ============================================================

SKILL_TIPS = {

    "aws":
        "Learn AWS cloud services and add a cloud-based project to your resume.",

    "amazon web services":
        "Highlight your AWS experience and mention specific services such as EC2 or S3.",

    "docker":
        "Add Docker containerization experience and mention a project where you used Docker.",

    "kubernetes":
        "Learn Kubernetes fundamentals and add container orchestration experience.",

    "machine learning":
        "Build an end-to-end machine learning project using scikit-learn.",

    "deep learning":
        "Add a deep learning project using TensorFlow or PyTorch.",

    "nlp":
        "Explore NLP using libraries such as Transformers, spaCy, or NLTK.",

    "natural language processing":
        "Build an NLP project and mention the techniques and models used.",

    "react":
        "Create a React project and highlight components, state management, and API integration.",

    "javascript":
        "Strengthen JavaScript fundamentals and demonstrate them through a web project.",

    "typescript":
        "Add a TypeScript project to demonstrate strongly typed frontend or backend development.",

    "python":
        "Highlight Python projects and mention the frameworks or libraries you used.",

    "java":
        "Add Java projects and demonstrate object-oriented programming and backend development.",

    "sql":
        "Strengthen SQL skills and include database queries, joins, aggregations, and optimization.",

    "postgresql":
        "Add PostgreSQL experience and mention schema design, queries, and database integration.",

    "mongodb":
        "Mention MongoDB database design and CRUD operations in your projects.",

    "fastapi":
        "Build a scalable REST API using FastAPI and highlight authentication and database integration.",

    "django":
        "Add a Django project demonstrating REST APIs, authentication, and database integration.",

    "node.js":
        "Build a Node.js backend project and highlight API development and asynchronous programming.",

    "git":
        "Mention Git workflows such as branching, merging, pull requests, and collaborative development.",

    "github":
        "Add your GitHub profile and highlight relevant projects and open-source contributions.",

    "power bi":
        "Add Power BI dashboards and mention the datasets, KPIs, and insights generated.",

    "tableau":
        "Create an interactive Tableau dashboard and highlight the business insights obtained.",

    "excel":
        "Highlight Excel skills such as pivot tables, lookup functions, charts, and data analysis.",

    "tensorflow":
        "Build a deep learning project using TensorFlow and explain the model and results.",

    "pytorch":
        "Add a PyTorch-based machine learning or deep learning project.",

    "scikit-learn":
        "Mention specific scikit-learn algorithms and evaluation metrics used in your projects."
}


# ============================================================
# ACTION VERB RECOMMENDATIONS
# ============================================================

ACTION_VERBS = [
    "developed",
    "built",
    "created",
    "implemented",
    "designed",
    "engineered",
    "optimized",
    "automated",
    "deployed",
    "integrated",
    "analyzed",
    "improved",
    "reduced",
    "increased",
    "managed",
    "led",
    "delivered",
    "configured",
    "developed"
]


# ============================================================
# FIND MISSING SKILLS
# ============================================================

def find_missing_skills(
    resume_skills: list,
    jd_text: str
) -> list:
    """
    Compare resume skills against skills
    mentioned in the job description.
    """

    if not jd_text:
        return []

    jd_lower = jd_text.lower()

    resume_lower = {
        skill.lower()
        for skill in resume_skills
    }

    all_skills = []

    for category in HARD_SKILLS.values():

        all_skills.extend(category)

    # Remove duplicates
    all_skills = list(
        dict.fromkeys(all_skills)
    )

    missing = []

    for skill in all_skills:

        skill_lower = skill.lower()

        pattern = (
            r"(?<!\w)"
            + re.escape(skill_lower)
            + r"(?!\w)"
        )

        if (
            re.search(pattern, jd_lower)
            and skill_lower not in resume_lower
        ):
            missing.append(skill)

    return missing


# ============================================================
# MISSING SKILL RECOMMENDATION
# ============================================================

def generate_skill_recommendation(
    skill: str
) -> str:
    """
    Generate an actionable recommendation
    for a missing skill.
    """

    skill_lower = skill.lower()

    if skill_lower in SKILL_TIPS:

        return SKILL_TIPS[skill_lower]

    return (
        f"Consider adding {skill} to your skill set "
        f"and demonstrate it through a relevant project."
    )


# ============================================================
# ACTION VERB CHECK
# ============================================================

def check_action_verbs(
    resume_text: str
) -> str:
    """
    Check whether the resume uses strong action verbs.
    """

    if not resume_text:
        return (
            "Use strong action verbs such as "
            "Developed, Built, Implemented, Optimized, "
            "Designed, and Automated."
        )

    text = resume_text.lower()

    found_verbs = []

    for verb in ACTION_VERBS:

        if re.search(
            r"\b" + re.escape(verb) + r"\b",
            text
        ):
            found_verbs.append(verb)

    if len(found_verbs) < 3:

        return (
            "Add stronger action verbs such as "
            "Developed, Built, Implemented, Optimized, "
            "Designed, or Automated to describe your achievements."
        )

    return None


# ============================================================
# QUANTIFICATION CHECK
# ============================================================

def check_quantification(
    resume_text: str
) -> str:
    """
    Check whether resume achievements contain
    measurable numbers.
    """

    if not resume_text:
        return (
            "Quantify your achievements using numbers, "
            "percentages, time saved, users served, "
            "or performance improvements."
        )

    # Look for numbers, percentages, currency,
    # or common measurement expressions.
    numbers = re.findall(
        r"\b\d+(?:\.\d+)?%?"
        r"|\$\d+(?:,\d+)*(?:\.\d+)?",
        resume_text
    )

    if len(numbers) < 3:

        return (
            "Quantify your achievements where possible. "
            "For example, mention performance improvements, "
            "users served, projects completed, or time saved."
        )

    return None


# ============================================================
# JD KEYWORD CHECK
# ============================================================

def check_jd_keywords(
    resume_text: str,
    jd_text: str
) -> str:
    """
    Check whether the resume contains important
    keywords from the job description.
    """

    if not jd_text:
        return None

    if not resume_text:
        return (
            "Include relevant keywords from the job description "
            "throughout your resume."
        )

    resume_lower = resume_text.lower()
    jd_lower = jd_text.lower()

    important_keywords = []

    for category in HARD_SKILLS.values():

        for skill in category:

            skill_lower = skill.lower()

            pattern = (
                r"(?<!\w)"
                + re.escape(skill_lower)
                + r"(?!\w)"
            )

            if re.search(
                pattern,
                jd_lower
            ):
                important_keywords.append(skill)

    missing_keywords = []

    for skill in important_keywords:

        pattern = (
            r"(?<!\w)"
            + re.escape(skill.lower())
            + r"(?!\w)"
        )

        if not re.search(
            pattern,
            resume_lower
        ):
            missing_keywords.append(skill)

    if missing_keywords:

        # Show only the most relevant first few
        display = ", ".join(
            missing_keywords[:5]
        )

        return (
            f"Include relevant missing keywords "
            f"from the job description: {display}."
        )

    return None


# ============================================================
# MAIN RECOMMENDATION ENGINE
# ============================================================

def gen_recommendation(
    resume_skill: list,
    jd_text: str,
    resume_text: str = ""
) -> list:
    """
    Generate actionable resume improvement recommendations.

    Parameters:
        resume_skill:
            Skills detected from resume.

        jd_text:
            Job description.

        resume_text:
            Full extracted resume text.

    Returns:
        List of recommendation objects.
    """

    recommendations = []

    # --------------------------------------------------------
    # No Job Description
    # --------------------------------------------------------

    if not jd_text or not jd_text.strip():

        action_tip = check_action_verbs(
            resume_text
        )

        if action_tip:
            recommendations.append({
                "type": "content",
                "priority": "medium",
                "message": action_tip
            })

        quantity_tip = check_quantification(
            resume_text
        )

        if quantity_tip:
            recommendations.append({
                "type": "achievement",
                "priority": "high",
                "message": quantity_tip
            })

        if not recommendations:

            recommendations.append({
                "type": "general",
                "priority": "low",
                "message":
                    "Your resume looks reasonably complete. "
                    "Consider tailoring it to each job description."
            })

        return recommendations

    # --------------------------------------------------------
    # Find Missing Skills
    # --------------------------------------------------------

    missing_skills = find_missing_skills(
        resume_skill,
        jd_text
    )

    # --------------------------------------------------------
    # Generate Skill Recommendations
    # --------------------------------------------------------

    for skill in missing_skills[:8]:

        recommendations.append({

            "type": "skill",

            "priority": "high",

            "skill": skill,

            "message":
                generate_skill_recommendation(skill)
        })

    # --------------------------------------------------------
    # Action Verbs
    # --------------------------------------------------------

    action_tip = check_action_verbs(
        resume_text
    )

    if action_tip:

        recommendations.append({

            "type": "content",

            "priority": "medium",

            "message": action_tip
        })

    # --------------------------------------------------------
    # Quantification
    # --------------------------------------------------------

    quantity_tip = check_quantification(
        resume_text
    )

    if quantity_tip:

        recommendations.append({

            "type": "achievement",

            "priority": "high",

            "message": quantity_tip
        })

    # --------------------------------------------------------
    # JD Keywords
    # --------------------------------------------------------

    keyword_tip = check_jd_keywords(
        resume_text,
        jd_text
    )

    if keyword_tip:

        recommendations.append({

            "type": "keyword",

            "priority": "high",

            "message": keyword_tip
        })

    # --------------------------------------------------------
    # No Problems Found
    # --------------------------------------------------------

    if not recommendations:

        recommendations.append({

            "type": "success",

            "priority": "low",

            "message":
                "Your resume aligns well with this job description. "
                "Continue tailoring your achievements and keywords "
                "to the specific role."
        })

    return recommendations