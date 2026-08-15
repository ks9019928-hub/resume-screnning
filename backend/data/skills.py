# ============================================================
# HARD SKILLS
# ============================================================

HARD_SKILLS = {

    "programming_languages": [
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C",
        "C++",
        "C#",
        "Go",
        "Rust",
        "PHP",
        "Ruby",
        "Kotlin",
        "Swift",
        "R",
        "MATLAB"
    ],

    "web_development": [
        "HTML",
        "CSS",
        "React",
        "React.js",
        "Next.js",
        "Angular",
        "Vue",
        "Vue.js",
        "Node.js",
        "Express",
        "Express.js",
        "Tailwind CSS",
        "Bootstrap",
        "Redux",
        "REST API",
        "RESTful API",
        "GraphQL"
    ],

    "backend": [
        "Django",
        "FastAPI",
        "Flask",
        "Spring",
        "Spring Boot",
        "Laravel",
        "ASP.NET",
        "NestJS"
    ],

    "databases": [
        "SQL",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "SQLite",
        "Oracle",
        "Redis",
        "Firebase",
        "DynamoDB",
        "Cassandra"
    ],

    "data_science": [
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "Scikit-learn",
        "SciPy",
        "TensorFlow",
        "PyTorch",
        "Keras",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "NLP",
        "Computer Vision",
        "Generative AI",
        "Large Language Models",
        "LLM",
        "Artificial Intelligence",
        "AI"
    ],

    "data_analysis": [
        "Excel",
        "Power BI",
        "Tableau",
        "Looker",
        "Data Visualization",
        "Data Analysis",
        "Statistics",
        "A/B Testing",
        "ETL"
    ],

    "cloud": [
        "AWS",
        "Amazon Web Services",
        "Microsoft Azure",
        "Azure",
        "Google Cloud",
        "GCP",
        "Cloud Computing",
        "EC2",
        "S3",
        "Lambda"
    ],

    "devops": [
        "Git",
        "GitHub",
        "GitLab",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "CI/CD",
        "Terraform",
        "Linux",
        "Nginx"
    ],

    "ai_ml": [
        "Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
        "NLP",
        "Natural Language Processing",
        "Computer Vision",
        "Reinforcement Learning",
        "Neural Networks",
        "Transformers",
        "Hugging Face",
        "OpenCV"
    ],

    "software_engineering": [
        "Data Structures",
        "Algorithms",
        "Object Oriented Programming",
        "OOP",
        "Design Patterns",
        "Microservices",
        "System Design",
        "Software Development",
        "Unit Testing",
        "API Development",
        "Software Testing"
    ],

    "tools": [
        "VS Code",
        "Visual Studio",
        "Jupyter",
        "Jupyter Notebook",
        "Postman",
        "Figma",
        "Docker Desktop"
    ]
}


# ============================================================
# SOFT SKILLS
# ============================================================

SOFT_SKILLS = [
    "Communication",
    "Leadership",
    "Teamwork",
    "Problem Solving",
    "Critical Thinking",
    "Time Management",
    "Adaptability",
    "Creativity",
    "Collaboration",
    "Decision Making",
    "Analytical Thinking",
    "Attention to Detail",
    "Project Management",
    "Presentation",
    "Interpersonal Skills",
    "Work Ethic",
    "Conflict Resolution",
    "Negotiation",
    "Mentoring",
    "Organization",
    "Planning",
    "Multitasking"
]


# ============================================================
# EDUCATION KEYWORDS
# ============================================================

EDUCATION_KEYWORDS = [
    "B.Tech",
    "BTech",
    "Bachelor of Technology",
    "B.E.",
    "BE",
    "Bachelor of Engineering",
    "B.Sc",
    "BSc",
    "Bachelor of Science",
    "BCA",
    "Bachelor of Computer Applications",
    "M.Tech",
    "MTech",
    "Master of Technology",
    "M.E.",
    "ME",
    "MCA",
    "Master of Computer Applications",
    "M.Sc",
    "MSc",
    "Master of Science",
    "MBA",
    "Master of Business Administration",
    "PhD",
    "Ph.D",
    "Doctor of Philosophy",
    "Diploma",
    "Intermediate",
    "Higher Secondary",
    "12th",
    "10th",
    "Secondary School"
]


# ============================================================
# EXPERIENCE KEYWORDS
# ============================================================

EXPERIENCE_KEYWORDS = [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "internship",
    "intern",
    "worked",
    "developer",
    "engineer",
    "analyst",
    "manager",
    "associate",
    "consultant",
    "trainee"
]


# ============================================================
# COMMON JOB ROLES
# ============================================================

JOB_ROLES = [
    "Software Engineer",
    "Software Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Web Developer",
    "Python Developer",
    "Java Developer",
    "React Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Database Administrator",
    "Business Analyst",
    "Product Manager",
    "Project Manager",
    "UI/UX Designer",
    "Cybersecurity Analyst"
]


# ============================================================
# COMBINED SKILL LIST
# ============================================================

SKILLS = []

for category in HARD_SKILLS.values():

    SKILLS.extend(
        category
    )

# Remove duplicates while preserving order
SKILLS = list(
    dict.fromkeys(SKILLS)
)