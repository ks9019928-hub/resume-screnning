import os
import google.generativeai as genai
from dotenv import load_dotenv
from services.rag import retrieve_relevant_chunks

load_dotenv()

# Configure the Gemini client
genai.configure(api_key=os.getenv("MY_API_KEY"))

# CORRECTION: Actually initialize the generative model
model = genai.GenerativeModel('gemini-1.5-flash')

def ask_resume_bot(resume_text, question):
    context = retrieve_relevant_chunks(question)

    prompt = f"""
    You are an AI career assistant.

    Relevant Resume Context:
    {context}

    User Question:
    {question}

    Give concise and practical advice.
    """
    
    # CORRECTION: Uncomment the generation and return statements
    response = model.generate_content(prompt)
    return response.text