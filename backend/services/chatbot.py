# ============================================================
# backend/services/chatbot.py
# AI Resume Career Assistant
# ============================================================

import os

import google.generativeai as genai

from dotenv import load_dotenv

from services.rag import (
    retrieve_relevant_chunks
)


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

API_KEY = os.getenv(
    "MY_API_KEY"
) or os.getenv(
    "GEMINI_API_KEY"
) or os.getenv(
    "GOOGLE_API_KEY"
)


def get_model():
    if not API_KEY:
        return None
    genai.configure(api_key=API_KEY)
    return genai.GenerativeModel("gemini-1.5-flash")



# ============================================================
# CONVERSATION STORAGE
# ============================================================

# Structure:
#
# {
#     "resume_id": [
#         {
#             "role": "user",
#             "content": "..."
#         },
#         {
#             "role": "assistant",
#             "content": "..."
#         }
#     ]
# }

conversation_history = {}


# ============================================================
# CHAT FUNCTION
# ============================================================

def ask_resume_bot(
    resume_text: str,
    question: str,
    analysis: dict = None,
    resume_id: str = "default"
):
    """
    Generate an AI response using:

    - Resume
    - RAG context
    - Resume analysis
    - Conversation history
    """

    if not question or not question.strip():

        return (
            "Please enter a question about your resume."
        )

    # --------------------------------------------------------
    # Retrieve relevant RAG context
    # --------------------------------------------------------

    relevant_context = (
        retrieve_relevant_chunks(
            question=question,
            resume_id=resume_id,
            top_k=3
        )
    )

    # --------------------------------------------------------
    # Analysis context
    # --------------------------------------------------------

    analysis_context = ""

    if analysis:

        analysis_context = f"""
RESUME ANALYSIS

Hard Skills:
{analysis.get("hard_skills", [])}

Skills by Category:
{analysis.get("skills_by_category", {})}

Soft Skills:
{analysis.get("soft_skills", [])}

Experience:
{analysis.get("experience_years", 0)} years

Education:
{analysis.get("education", [])}

Job Roles:
{analysis.get("job_roles", [])}

Contact:
{analysis.get("contact", {})}

Sections:
{analysis.get("sections", {})}
"""

    # --------------------------------------------------------
    # Resume context
    # --------------------------------------------------------

    resume_context = f"""
RELEVANT RESUME CONTENT:
{relevant_context}

FULL RESUME:
{resume_text[:12000]}
"""

    # --------------------------------------------------------
    # Conversation history
    # --------------------------------------------------------

    history = conversation_history.get(
        resume_id,
        []
    )

    history_text = ""

    for message in history[-10:]:

        history_text += (
            f'{message["role"].upper()}: '
            f'{message["content"]}\n'
        )

    if not history_text:

        history_text = "No previous conversation."

    # --------------------------------------------------------
    # AI system instructions
    # --------------------------------------------------------

    system_context = """
You are an AI Career Assistant specializing
in resume improvement, ATS optimization,
job matching and career advice.

Your primary source of truth is the user's
provided resume.

IMPORTANT RULES:

1. Do not invent resume information.

2. Never invent:
   - Companies
   - Job titles
   - Skills
   - Education
   - Certifications
   - Achievements
   - Years of experience

3. If the resume does not contain requested
   information, clearly say that it is not
   present.

4. Give practical and actionable advice.

5. When rewriting resume content, preserve
   factual accuracy.

6. Use professional and ATS-friendly language.

7. Prefer strong action verbs.

8. Encourage measurable achievements when
   the user has real metrics available.

9. When providing rewritten content, do not
   fabricate numbers.

10. Use the resume analysis and RAG context
    to answer questions accurately.

11. Maintain continuity with the previous
    conversation.

12. Keep responses concise unless the user
    asks for detailed guidance.

13. If the user asks about their experience,
    skills, projects or education, refer to
    the actual resume context.
"""

    # --------------------------------------------------------
    # Build prompt
    # --------------------------------------------------------

    prompt = f"""
{system_context}

============================================================
RESUME CONTEXT
============================================================

{resume_context}

============================================================
ANALYSIS
============================================================

{analysis_context}

============================================================
PREVIOUS CONVERSATION
============================================================

{history_text}

============================================================
CURRENT QUESTION
============================================================

{question}

============================================================
ANSWER
============================================================

Answer the user's question using the resume,
analysis, retrieved context and previous conversation.
"""

    # --------------------------------------------------------
    # Generate response
    # --------------------------------------------------------

    ai_model = get_model()
    if not ai_model:
        return (
            "Gemini API key is not configured. Please set MY_API_KEY in backend/.env to use the AI assistant."
        )

    try:

        response = ai_model.generate_content(
            prompt
        )

        answer = getattr(
            response,
            "text",
            None
        )

        if not answer:

            answer = (
                "I couldn't generate a response "
                "for that question."
            )

    except Exception as e:

        print(
            f"Gemini error: {e}"
        )

        return (
            "I'm unable to process your request "
            "right now. Please try again."
        )


    # --------------------------------------------------------
    # Save conversation
    # --------------------------------------------------------

    if resume_id not in conversation_history:

        conversation_history[
            resume_id
        ] = []

    conversation_history[
        resume_id
    ].append({

        "role": "user",

        "content": question
    })

    conversation_history[
        resume_id
    ].append({

        "role": "assistant",

        "content": answer
    })

    # Keep last 20 messages
    conversation_history[
        resume_id
    ] = conversation_history[
        resume_id
    ][-20:]

    return answer


# ============================================================
# CLEAR CHAT
# ============================================================

def clear_conversation(
    resume_id: str
):
    """
    Clear conversation history for a resume.
    """

    conversation_history.pop(
        resume_id,
        None
    )