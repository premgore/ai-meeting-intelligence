from fastapi import APIRouter
from app.api.v1.endpoints.echo import router as echo_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.meeting import router as meeting_router
from app.api.v1.endpoints.user import router as user_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.upload import router as upload_router


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
    user_router,
    prefix="/api/v1",
    tags=["Users"],
)
api_router.include_router(
    meeting_router,
    prefix="/api/v1",
    tags=["Meeting"],
)
api_router.include_router(
    auth_router,
    prefix="/api/v1",
    tags=["Authentication"]
)
api_router.include_router(
    upload_router,
    prefix="/api/v1/audio",
    tags=["Audio Upload"],
)