import os
import google.generativeai as genai
from dotenv import load_dotenv
from services.rag import retrieve_relevant_chunks

load_dotenv()

# Configure the Gemini client
genai.configure(api_key=os.getenv("MY_API_KEY"))

def ask_resume_bot(resume_text, question):
    # Initialize the model (Gemini 1.5 Flash is great for speed and free tier)
   context = retrieve_relevant_chunks(question)

   prompt = f"""
   You are an AI career assistant.

   Relevant Resume Context:
   {context}

   User Question:
   {question}

Give concise and practical advice.
"""
    # Generate the response response = model.generate_content(prompt)

    # Gemini returns the text directly in the .text attribute return response.text