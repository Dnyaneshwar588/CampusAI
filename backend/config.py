import os
from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def _parse_origins() -> list[str]:
    """Parse ALLOWED_ORIGINS from env (comma-separated) or fall back to localhost defaults."""
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Campus Placement Strategist"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./placement_strategist.db")
    JWT_SECRET: str  # Required - will fail startup loudly if not set via env/file
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # API Keys Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Security/Upload Configuration
    ALLOWED_ORIGINS: list[str] = _parse_origins()
    MAX_RESUME_SIZE: int = 5 * 1024 * 1024  # 5MB
    MAX_RESUME_UPLOADS_PER_HOUR: int = 5

    # Directories
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    VECTOR_DB_DIR: Path = BASE_DIR / "vector_db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.VECTOR_DB_DIR.mkdir(parents=True, exist_ok=True)
