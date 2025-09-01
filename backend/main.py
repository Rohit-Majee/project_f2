from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Project F2 API", version="1.0.0")


class NewsRequest(BaseModel):
    text: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],        
)

@app.get("/")
def serve():
    return {"message" : "server is live"}

# Fake News Analysis
@app.post("/api/fakenews")
async def analyze_fake_news(request: NewsRequest):
 
    # Input: JSON { "text": "news article text" }
   
    try:
        text = request.text.strip()

        if not text:
            raise HTTPException(status_code=400, detail="News text cannot be empty.")

        lowered = text.lower()
        if "breaking" in lowered or "exclusive" in lowered:
            result = "Likely Fake News"
            confidence = 0.85
        else:
            result = "Likely Real News"
            confidence = 0.72

        return {"status": "success", "result": result, "confidence": confidence}

    except HTTPException as e:
        raise e
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Internal Server Error: {str(e)}"},
        )


# Deep Fake Analysis
@app.post("/api/deepfake")
async def analyze_deepfake(file: UploadFile = File(...)):
    
    # Input: image or video file
    
    try:
        filename = file.filename

        if not filename:
            raise HTTPException(status_code=400, detail="No file uploaded.")

        valid_extensions = (".jpg", ".jpeg", ".png", ".mp4", ".avi", ".mov")
        if not filename.lower().endswith(valid_extensions):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(valid_extensions)}",
            )

        if filename.lower().endswith((".mp4", ".avi", ".mov")):
            result = "Possibly Deepfake Video"
            confidence = 0.65
        else:
            result = "Likely Authentic Image"
            confidence = 0.80

        return {
            "status": "success",
            "filename": filename,
            "result": result,
            "confidence": confidence,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Internal Server Error: {str(e)}"},
        )
