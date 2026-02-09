"""
Data Models for MongoDB Collections
"""
from beanie import Document
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

# Embedded Models
class DailyStats(BaseModel):
    date: datetime
    followers: int = 0
    engagement_rate: float = 0.0
    likes: int = 0
    comments: int = 0
    shares: int = 0

class Post(BaseModel):
    id: str = ""
    caption: str = ""
    content_type: str = "Post"  # Reel, Post, Carousel
    likes: int = 0
    comments: int = 0
    shares: int = 0
    timestamp: Optional[datetime] = None
    url: str = ""

# Document Models (MongoDB Collections)
class UserAnalytics(Document):
    """Your Instagram analytics from Meta Graph API"""
    page_id: str
    username: str = ""
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    profile_pic_url: str = ""
    
    # Calculated Fields for easy access
    engagement_rate: float = 0.0
    avg_likes: int = 0
    avg_comments: int = 0
    posts_per_week: int = 0
    
    daily_stats: List[DailyStats] = []
    recent_posts: List[Post] = []
    last_updated: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "user_analytics"

class Competitor(Document):
    """Competitor data scraped by Apify"""
    username: str
    full_name: str = ""
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    profile_pic_url: str = ""
    biography: str = ""
    is_verified: bool = False
    
    # Calculated Fields
    engagement_rate: float = 0.0
    avg_likes: int = 0
    posts_per_week: int = 0
    content_mix: dict = {}
    top_hashtags: List[Any] = []
    top_post: dict = {}
    
    recent_posts: List[Any] = []  # Raw Apify data
    scraped_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "competitors"

class Insight(Document):
    """AI-generated insights"""
    insight_type: str  # gap_analysis, recommendation, trend, opportunity, risk, action
    title: str
    description: str
    priority: str = "medium"  # low, medium, high
    category: str = "General"
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "insights"
