from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
)
def health_check():
    return HealthResponse(
        status="healthy",
        service="AI Meeting Intelligence",
        version="1.0.0",
    )