from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Meeting Intelligence",
        "version": "1.0.0"
    }