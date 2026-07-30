from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    health,
    meeting,
    user,
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(user.router, prefix="/users")
api_router.include_router(auth.router)
api_router.include_router(meeting.router)