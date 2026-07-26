from fastapi import FastAPI

from app.api.v1.endpoints.health import router as health_router

app = FastAPI(
    title="AI Meeting Intelligence",
    version="1.0.0"
)

app.include_router(health_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Meeting Intelligence 🚀"
    }