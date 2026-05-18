from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

resume_chunks = []

index = faiss.IndexFlatL2(384)


def chunk_text(text, chunk_size=300):

    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks

def store_resume_embeddings(text):

    global resume_chunks

    chunks = chunk_text(text)

    embeddings = model.encode(chunks)

    index.add(np.array(embeddings).astype("float32"))

    resume_chunks = chunks

def retrieve_relevant_chunks(query, top_k=3):

    query_embedding = model.encode([query])

    distances, indices = index.search(
        np.array(query_embedding).astype("float32"),
        top_k
    )

    results = []

    for idx in indices[0]:

        if idx < len(resume_chunks):
            results.append(resume_chunks[idx])

    return "\n".join(results)