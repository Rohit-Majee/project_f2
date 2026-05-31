from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.services.fakenews_service import predict_traditional, predict_roberta

router = APIRouter(prefix="/api/fakenews", tags=["Fake News"])

class NewsRequest(BaseModel):
    text: str
    model_choice: str = "roberta"  # 'traditional' or 'roberta'

@router.post("")
async def analyze_fake_news(request: NewsRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    choice = request.model_choice.lower().strip()
    try:
        if choice in ["traditional", "svm"]:
            prediction, confidence = predict_traditional(request.text)
            used_model = "Traditional ML"
        elif choice in ["roberta", "transformer"]:
            prediction, confidence = predict_roberta(request.text)
            used_model = "RoBERTa"
        else:
            raise HTTPException(status_code=400, detail="Invalid model choice.")

        return {
            "status": "success",
            "model_used": used_model,
            "result": prediction,
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))