from fastapi import APIRouter
from app.api.v1.endpoints.echo import router as echo_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.meeting import router as meeting_router

api_router = APIRouter()

api_router.include_router(
    health_router,
    prefix="/api/v1",
    tags=["Health"],
)
api_router.include_router(
    echo_router,
    prefix="/api/v1",
    tags=["Echo"],
)
api_router.include_router(
    meeting_router,
    prefix="/api/v1",
    tags=["Meeting"],
)