"""
Competitors Router - Data from MongoDB (scraped by Apify via n8n)
"""
from fastapi import APIRouter, Response
from fastapi.responses import StreamingResponse
from typing import List
import httpx
from models import Competitor

router = APIRouter(prefix="/api/competitors", tags=["Competitors"])

@router.get("/proxy-image")
async def proxy_profile_image(url: str):
    """
    Proxy Instagram profile images to avoid CORS issues.
    Usage: /api/competitors/proxy-image?url=<instagram_cdn_url>
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, follow_redirects=True)
            return Response(
                content=response.content,
                media_type=response.headers.get("content-type", "image/jpeg")
            )
    except Exception as e:
        # Return a placeholder image on error
        return Response(content=b"", status_code=404)

@router.get("/")
async def get_competitors():
    """
    Get competitor data from MongoDB.
    This data is populated by n8n when Apify scrapes complete.
    """
    competitors = await Competitor.find_all().to_list()
    return competitors

@router.get("/{username}")
async def get_competitor_by_username(username: str):
    """Get specific competitor by username"""
    competitor = await Competitor.find_one(Competitor.username == username)
    if not competitor:
        return {"error": f"Competitor '{username}' not found"}
    return competitor

@router.get("/comparison/followers")
async def compare_followers():
    """Compare follower counts across all competitors"""
    competitors = await Competitor.find_all().to_list()
    return [
        {
            "username": c.username,
            "followers": c.followers_count,
            "posts_count": c.posts_count
        }
        for c in competitors
    ]
