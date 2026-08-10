# backend/services/rag.py

import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# EMBEDDING MODEL
# ============================================================

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# ============================================================
# IN-MEMORY RESUME STORAGE
# ============================================================

resume_chunks = []


# ============================================================
# TEXT CHUNKING
# ============================================================

def chunk_text(
    text: str,
    chunk_size: int = 500
) -> list:
    """
    Split resume text into smaller chunks.
    """

    if not text:
        return []

    # Normalize whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    words = text.split()

    chunks = []

    for i in range(
        0,
        len(words),
        chunk_size
    ):

        chunk = " ".join(
            words[i:i + chunk_size]
        )

        if chunk.strip():
            chunks.append(chunk)

    return chunks


# ============================================================
# STORE RESUME EMBEDDINGS
# ============================================================

def store_resume_embeddings(
    resume_text: str
):
    """
    Create embeddings for resume chunks
    and store them in memory.

    Returns the created chunks.
    """

    global resume_chunks

    chunks = chunk_text(
        resume_text
    )

    if not chunks:
        resume_chunks = []
        return []

    embeddings = model.encode(
        chunks
    )

    resume_chunks = []

    for chunk, embedding in zip(
        chunks,
        embeddings
    ):

        resume_chunks.append({

            "text": chunk,

            "embedding": embedding
        })

    return resume_chunks


# ============================================================
# RETRIEVE RELEVANT CHUNKS
# ============================================================

def retrieve_relevant_chunks(
    question: str,
    top_k: int = 3
) -> str:
    """
    Retrieve the most relevant resume chunks
    for the user's question.
    """

    if not question:
        return ""

    if not resume_chunks:
        return ""

    question_embedding = model.encode(
        [question]
    )[0]

    similarities = []

    for item in resume_chunks:

        score = cosine_similarity(
            [question_embedding],
            [item["embedding"]]
        )[0][0]

        similarities.append(
            (
                score,
                item["text"]
            )
        )

    similarities.sort(
        key=lambda x: x[0],
        reverse=True
    )

    selected = similarities[:top_k]

    return "\n\n".join(
        item[1]
        for item in selected
    )