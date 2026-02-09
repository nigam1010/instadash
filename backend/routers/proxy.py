from fastapi import APIRouter, Response, HTTPException
import requests

router = APIRouter(prefix="/api/proxy", tags=["Proxy"])

@router.get("/")
def proxy_image(url: str):
    """
    Proxies image requests to avoid CORS issues.
    Matches /api/proxy/ (with trailing slash) or /api/proxy depending on client.
    """
    if not url:
        raise HTTPException(status_code=400, detail="Missing URL")
    
    try:
        # User-Agent to mimick browser
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        resp = requests.get(url, headers=headers, stream=True, timeout=10)
        
        if resp.status_code != 200:
            return Response(status_code=404)
        
        return Response(content=resp.content, media_type=resp.headers.get("content-type", "image/jpeg"))
        
    except Exception as e:
        print(f"Proxy error for {url}: {e}")
        # Return a 1x1 pixel or failure to avoid breaking UI? 
        # Better to return 500 and let UI handle error
        raise HTTPException(status_code=500, detail="Failed to fetch image")
