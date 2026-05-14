from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def ask_resume_bot(resume_text, question):

    prompt = f"""
    You are an AI career assistant.

    Resume:
    {resume_text}

    User Question:
    {question}

    Give concise, practical, and professional advice.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content