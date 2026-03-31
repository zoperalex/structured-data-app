import os


class Config:
    @staticmethod
    def gemini_api_key() -> str:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise ValueError("GEMINI_API_KEY is not set")
        return key
