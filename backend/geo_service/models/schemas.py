from pydantic import BaseModel

class CaptionRequest(BaseModel):
    topic: str
    platform: str
    tone: str

class OptimizeRequest(BaseModel):
    caption: str
    tone: str
    target_language: str = "English"
    generate_variants: bool = False

class EngagementRequest(BaseModel):
    content: str

class LanguageRequest(BaseModel):
    content: str
