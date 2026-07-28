from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logger import logger
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME}...")
    logger.info("Application is ready.")

    yield

    logger.info(f"Shutting down {settings.APP_NAME}...")