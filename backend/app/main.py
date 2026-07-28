from fastapi import FastAPI
from app.core.config import settings
from app.core.logger import logger
from app.api.router import api_router
from app.core.lifespan import lifespan
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.exceptions.handlers import (
    http_exception_handler,
    validation_exception_handler,
)

from app.api.v1.endpoints.health import router as health_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.include_router(api_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Meeting Intelligence "
    }


app.add_exception_handler(
    StarletteHTTPException,
    http_exception_handler,
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)