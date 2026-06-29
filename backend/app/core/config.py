from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    ENVIRONMENT: str = "development"

    DATABASE_URL: str = "postgresql+psycopg2://pdftoolbox:change_me@localhost:5432/pdftoolbox"

    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    JWT_SECRET_KEY: str = "change_me_to_a_long_random_string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    STORAGE_BACKEND: str = "local"
    STORAGE_PATH: str = "./storage"

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    MAX_UPLOAD_SIZE_MB: int = 100


settings = Settings()
print("DATABASE_URL =", settings.DATABASE_URL)