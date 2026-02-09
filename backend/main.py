"""
Social Media Analytics Dashboard - Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routers import analytics, competitors, insights, proxy
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown

app = FastAPI(
    title="Social Media Analytics API",
    description="API for Social Media Analytics Dashboard",
    lifespan=lifespan
)

# CORS - Allow localhost for dev and all Vercel domains for production
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

# Also allow all vercel.app subdomains for preview deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(analytics.router)
app.include_router(competitors.router)
app.include_router(insights.router)
app.include_router(proxy.router)

@app.get("/")
def root():
    return {"message": "Social Media Analytics API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
