from pydantic import BaseModel

class CaptionRequest(BaseModel):
    topic: str
    platform: str
    tone: str

class OptimizeRequest(BaseModel):
    content: str
    target_language: str = "English"

class EngagementRequest(BaseModel):
    content: str

class LanguageRequest(BaseModel):
    content: str
