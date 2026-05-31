from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.image_service import predict_image
from app.services.video_service import predict_video

router = APIRouter(prefix="/api/deepfake", tags=["Deepfake Media"])

@router.post("")
async def detect_deepfake(
    file: UploadFile = File(...),
    type: str = Form(...)
):
    data = await file.read()
    filename = file.filename

    if type == "image":
        try:
            metrics = predict_image(data)
            return {"status": "success", "mode": "image", "filename": filename, **metrics}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

    elif type == "video":
        try:
            metrics = predict_video(data)
            return {"status": "success", "mode": "video", "filename": filename, **metrics}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Video processing failed: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Type must be 'image' or 'video'")