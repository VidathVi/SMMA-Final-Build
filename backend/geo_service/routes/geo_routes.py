from fastapi import APIRouter
from models.schemas import CaptionRequest, OptimizeRequest, EngagementRequest, LanguageRequest
from services.openai_service import (
    generate_caption, 
    optimize_text, 
    predict_engagement, 
    detect_language
)

router = APIRouter()

@router.post("/generate-caption")
def api_generate_caption(request: CaptionRequest):
    result = generate_caption(request.topic, request.platform, request.tone)
    return {"status": "success", "caption": result}

@router.post("/optimize-content")
def api_optimize_content(request: OptimizeRequest):
    result = optimize_text(request.content, request.target_language)
    return {
        "status": "success",
        "original_content": request.content,
        "optimized_content": result
    }

@router.post("/predict-engagement")
def api_predict_engagement(request: EngagementRequest):
    result = predict_engagement(request.content)
    return {"status": "success", "prediction": result}

@router.post("/detect-language")
def api_detect_language(request: LanguageRequest):
    result = detect_language(request.content)
    return {"status": "success", "language": result}
