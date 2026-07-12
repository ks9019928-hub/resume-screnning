from pymongo import MongoClient
MONGO_URL="mongodb+srv://ks9019928_db_user:v0gAgpjUGAz6fqkc@cluster0.qtsw7us.mongodb.net/?appName=Cluster0"
client=MongoClient(MONGO_URL)
db=client["resume_screening"]
candidates_collection = db["candidates"]
users_collection = db["users"]