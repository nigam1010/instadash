"""
Analytics Router - Your Instagram data from Meta Graph API
"""
from fastapi import APIRouter, HTTPException
import httpx
import os
from datetime import datetime, timedelta
from models import UserAnalytics, Post, DailyStats

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

META_BASE_URL = "https://graph.facebook.com/v19.0"

@router.get("/")
async def get_my_analytics():
    """Get your Instagram analytics from Meta Graph API AND SAVE TO DB"""
    page_id = os.getenv("META_PAGE_ID")
    access_token = os.getenv("META_ACCESS_TOKEN")
    
    if not page_id or not access_token:
        # If no creds, see if we have cached data
        cached = await UserAnalytics.find_one(UserAnalytics.page_id != None)
        if cached:
            return cached
        raise HTTPException(400, "Meta credentials not configured and no cached data")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # 1. Fetch page/profile info
            response = await client.get(
                f"{META_BASE_URL}/{page_id}",
                params={
                    "fields": "name,username,followers_count,follows_count,media_count,profile_picture_url",
                    "access_token": access_token
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # 2. Fetch recent media/posts
            media_response = await client.get(
                f"{META_BASE_URL}/{page_id}/media",
                params={
                    "fields": "id,caption,media_type,timestamp,like_count,comments_count,permalink,media_url",
                    "limit": 25, # Get enough for analysis
                    "access_token": access_token
                }
            )
            media_data = media_response.json().get("data", [])
            
            # 3. Process Data & Calculate Metrics
            followers = data.get("followers_count", 0) or 1 # Avoid div/0
            
            total_likes = 0
            total_comments = 0
            posts_last_7_days = 0
            processed_posts = []
            
            now = datetime.now()
            
            for m in media_data:
                likes = m.get("like_count", 0)
                comments = m.get("comments_count", 0)
                total_likes += likes
                total_comments += comments
                
                # Timestamp parsing
                try:
                    ts_str = m.get("timestamp")
                    ts = datetime.fromisoformat(ts_str.replace('Z', '+00:00')) if ts_str else None
                    
                    if ts and (now - ts.replace(tzinfo=None)).days <= 7:
                        posts_last_7_days += 1
                except:
                    ts = None

                processed_posts.append(Post(
                    id=m.get("id"),
                    caption=m.get("caption", ""),
                    content_type=m.get("media_type", "IMAGE"),
                    likes=likes,
                    comments=comments,
                    timestamp=ts,
                    url=m.get("permalink") or m.get("media_url", "")
                ))

            post_count = len(media_data)
            avg_likes = (total_likes / post_count) if post_count > 0 else 0
            avg_comments = (total_comments / post_count) if post_count > 0 else 0
            
            # Engagement Rate = (Total Interactions / Post Count) / Followers * 100
            engagement_rate = 0
            if post_count > 0 and followers > 0:
                avg_interactions = (total_likes + total_comments) / post_count
                engagement_rate = (avg_interactions / followers) * 100

            # 4. Update or Create DB Document
            user_analytics = await UserAnalytics.find_one(UserAnalytics.page_id == page_id)
            if not user_analytics:
                user_analytics = UserAnalytics(page_id=page_id)
            
            # Update fields
            user_analytics.username = data.get("username", "")
            user_analytics.followers_count = data.get("followers_count", 0)
            user_analytics.following_count = data.get("follows_count", 0)
            user_analytics.posts_count = data.get("media_count", 0)
            user_analytics.profile_pic_url = data.get("profile_picture_url", "")
            
            # Save calculated metrics
            user_analytics.engagement_rate = engagement_rate
            user_analytics.avg_likes = int(avg_likes)
            user_analytics.avg_comments = int(avg_comments)
            user_analytics.posts_per_week = posts_last_7_days
            user_analytics.recent_posts = processed_posts
            user_analytics.last_updated = datetime.now()
            
            await user_analytics.save()
            
            return user_analytics
            
        except httpx.HTTPError as e:
            # If API fails, return cached if exists
            cached = await UserAnalytics.find_one(UserAnalytics.page_id == page_id)
            if cached:
                return cached
            raise HTTPException(500, f"Meta API error: {str(e)}")

@router.get("/cached")
async def get_cached_analytics():
    """Get cached analytics from MongoDB"""
    analytics = await UserAnalytics.find_all().to_list()
    return analytics
