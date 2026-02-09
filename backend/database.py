"""
MongoDB Atlas Database Connection
"""
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv
from models import UserAnalytics, Competitor, Insight

load_dotenv()

client = None

async def init_db():
    global client
    mongo_url = os.getenv("MONGODB_URL")
    print(f"Connecting to MongoDB Atlas...")
    
    client = AsyncIOMotorClient(mongo_url)
    await init_beanie(
        database=client.social_dashboard,
        document_models=[UserAnalytics, Competitor, Insight]
    )
    print("✅ Connected to MongoDB Atlas")

def get_database():
    return client.social_dashboard
