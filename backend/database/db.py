import logging
import os
from dotenv import load_dotenv
from pymongo import MongoClient

logger = logging.getLogger("screening_db")

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "")

client = None
db = None

if MONGO_URL:
    try:
        candidate_client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2500)
        candidate_client.admin.command("ping")
        client = candidate_client
        db = client["resume_screening"]
        logger.info("Successfully connected to live MongoDB instance.")
    except Exception as exc:
        logger.warning(
            "Failed to connect to MONGO_URL (%s). Falling back to mock MongoDB in memory. Error: %s",
            MONGO_URL,
            exc,
        )

if db is None:
    try:
        import mongomock
        client = mongomock.MongoClient()
        db = client["resume_screening"]
        logger.info("Using mongomock in-memory database for local session storage.")
    except Exception:
        # Fallback to direct client if mongomock is somehow missing
        client = MongoClient(serverSelectionTimeoutMS=2000)
        db = client["resume_screening"]

candidates_collection = db["candidates"]
users_collection = db["users"]