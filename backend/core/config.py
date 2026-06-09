import os
import json
from dotenv import load_dotenv

load_dotenv()

def get_cors_origins() -> list[str]:
    raw_cors = os.getenv("CORS_ORIGINS")
    if raw_cors:
        try:
            # Attempt to parse as JSON array '["https://domain.com"]'
            return json.loads(raw_cors)
        except json.JSONDecodeError:
            # Fallback for comma separated 'https://domain.com,https://other.com'
            return [origin.strip() for origin in raw_cors.split(",")]
    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "council_ai")
    CORS_ORIGINS: list[str] = get_cors_origins()


settings = Settings()
