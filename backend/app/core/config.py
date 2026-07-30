from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    APP_ENV: str
    APP_VERSION: str
    APP_PORT: int

    DATABASE_URL: str

    LOG_LEVEL: str = "INFO"

    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GROQ_API_KEY: str
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()