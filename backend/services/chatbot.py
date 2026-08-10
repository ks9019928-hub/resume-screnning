# backend/services/chatbot.py

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
)

if not API_KEY:
    raise RuntimeError(
        "MY_API_KEY is not configured."
    )

genai.configure(
    api_key=API_KEY
)


model = genai.GenerativeModel(
    "gemini-1.5-flash"
)


# ============================================================
# CONVERSATION HISTORY
# ============================================================

conversation_history = []


# ============================================================
# CHAT FUNCTION
# ============================================================

def ask_resume_bot(
    resume_text: str,
    question: str,
    analysis: dict = None
):
    """
    Ask the AI career assistant a question
    using resume + analysis + conversation history.
    """

    global conversation_history

    if not question.strip():

        return (
            "Please enter a question about your resume."
        )

    # --------------------------------------------------------
    # Retrieve relevant resume context
    # --------------------------------------------------------

    relevant_context = retrieve_relevant_chunks(
        question
    )

    # --------------------------------------------------------
    # Analysis context
    # --------------------------------------------------------

    analysis_context = ""

    if analysis:

        analysis_context = f"""
Resume Analysis:

Hard Skills:
{analysis.get("hard_skills", [])}

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
"""

    # --------------------------------------------------------
    # Resume context
    # --------------------------------------------------------

    resume_context = f"""
Relevant Resume Content:
{relevant_context}

Full Resume:
{resume_text[:12000]}
"""

    # --------------------------------------------------------
    # Conversation history
    # --------------------------------------------------------

    history_text = ""

    for message in conversation_history[-10:]:

        history_text += (
            f'{message["role"].upper()}: '
            f'{message["content"]}\n'
        )

    # --------------------------------------------------------
    # System instructions
    # --------------------------------------------------------

    system_context = """
You are an AI Career Assistant specializing in
resume improvement and job applications.

Your job is to help the user improve their resume.

Rules:

1. Use the provided resume information as the primary source.
2. Use the resume analysis when discussing skills,
   experience, education, or ATS results.
3. Do not invent experience, skills, qualifications,
   employers, achievements, or education.
4. If something is not present in the resume, say so.
5. Give practical and actionable recommendations.
6. When rewriting resume content, preserve factual accuracy.
7. Use strong professional language.
8. When appropriate, provide a before/after example.
9. Keep responses concise unless the user asks for detail.
10. Remember the previous conversation when answering follow-up
    questions.
"""

    # --------------------------------------------------------
    # Build prompt
    # --------------------------------------------------------

    prompt = f"""
{system_context}

{resume_context}

{analysis_context}

Previous Conversation:
{history_text}

Current User Question:
{question}

Answer the user's question based on the available
resume context and conversation history.
"""

    # --------------------------------------------------------
    # Generate response
    # --------------------------------------------------------

    try:

        response = model.generate_content(
            prompt
        )

        answer = response.text

    except Exception as e:

        return (
            "I'm unable to process your request right now. "
            f"Error: {str(e)}"
        )

    # --------------------------------------------------------
    # Save conversation
    # --------------------------------------------------------

    conversation_history.append({

        "role": "user",

        "content": question
    })

    conversation_history.append({

        "role": "assistant",

        "content": answer
    })

    # Keep memory manageable
    conversation_history = (
        conversation_history[-20:]
    )

    return answer