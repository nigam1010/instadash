from .analytics import router as analytics_router
from .competitors import router as competitors_router
from .insights import router as insights_router
from .proxy import router as proxy_router

__all__ = ["analytics", "competitors", "insights", "proxy"]
