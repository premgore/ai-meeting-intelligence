from fastapi import FastAPI
from app.core.config import settings

from app.api.v1.endpoints.health import router as health_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.include_router(health_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Meeting Intelligence "
    }