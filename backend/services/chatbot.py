import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini client
genai.configure(api_key=os.getenv("MY_API_KEY"))

def ask_resume_bot(resume_text, question):
    # Initialize the model (Gemini 1.5 Flash is great for speed and free tier)
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    You are an AI career assistant.

    Resume:
    {resume_text}

    User Question:
    {question}

    Give concise, practical, and professional advice.
    """

    # Generate the response
    response = model.generate_content(prompt)

    # Gemini returns the text directly in the .text attribute
    return response.text