# ============================================================
# backend/services/rag.py
# Resume Retrieval / RAG Engine
# ============================================================

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
# RESUME STORAGE
# ============================================================

# Structure:
#
# {
#     "resume_id": [
#         {
#             "text": "...",
#             "embedding": [...]
#         }
#     ]
# }

resume_store = {}


# ============================================================
# TEXT CHUNKING
# ============================================================

def chunk_text(
    text: str,
    chunk_size: int = 300
) -> list:
    """
    Split resume text into smaller chunks.
    """

    if not text:
        return []

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
            words[
                i:i + chunk_size
            ]
        )

        if chunk.strip():

            chunks.append(
                chunk
            )

    return chunks


# ============================================================
# STORE RESUME EMBEDDINGS
# ============================================================

def store_resume_embeddings(
    resume_text: str,
    resume_id: str = "default"
):
    """
    Create embeddings for resume chunks
    and store them against a resume ID.
    """

    chunks = chunk_text(
        resume_text
    )

    if not chunks:

        resume_store[
            resume_id
        ] = []

        return []

    embeddings = model.encode(
        chunks
    )

    stored_chunks = []

    for chunk, embedding in zip(
        chunks,
        embeddings
    ):

        stored_chunks.append({

            "text": chunk,

            "embedding": embedding
        })

    resume_store[
        resume_id
    ] = stored_chunks

    return stored_chunks


# ============================================================
# RETRIEVE RELEVANT CHUNKS
# ============================================================

def retrieve_relevant_chunks(
    question: str,
    resume_id: str = "default",
    top_k: int = 3
) -> str:
    """
    Retrieve resume chunks most relevant
    to the user's question.
    """

    if not question:

        return ""

    chunks = resume_store.get(
        resume_id,
        []
    )

    if not chunks:

        return ""

    question_embedding = model.encode(
        [question]
    )[0]

    similarities = []

    for item in chunks:

        score = cosine_similarity(

            [question_embedding],

            [item["embedding"]]

        )[0][0]

        similarities.append(
            (
                float(score),
                item["text"]
            )
        )

    similarities.sort(
        key=lambda item: item[0],
        reverse=True
    )

    selected = similarities[
        :top_k
    ]

    return "\n\n".join(
        item[1]
        for item in selected
    )


# ============================================================
# DELETE RESUME FROM RAG STORE
# ============================================================

def delete_resume_embeddings(
    resume_id: str
):
    """
    Remove a resume from the in-memory
    RAG store.
    """

    resume_store.pop(
        resume_id,
        None
    )