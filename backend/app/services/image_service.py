import cv2
import numpy as np
import torch
import torch.nn.functional as F
from functools import lru_cache
from torchvision.transforms import v2
from app.config import DEVICE, IMAGE_MODEL_PATH, IMG_SIZE, IMAGE_THRESHOLD
from app.models.image_model import get_image_model

_MEAN, _STD = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]
val_transform = v2.Compose([
    v2.Resize((IMG_SIZE, IMG_SIZE), antialias=True),
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(mean=_MEAN, std=_STD),
])

@lru_cache()
def load_image_model():
    model = get_image_model().to(DEVICE)
    # Load your new deepfake_image_detector_b3_best.pth file here
    model.load_state_dict(torch.load(IMAGE_MODEL_PATH, map_location=DEVICE, weights_only=True))
    model.eval()
    return model

def predict_image(image_bytes: bytes) -> dict:
    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    if img is None: raise ValueError("Invalid image file format.")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_tensor = torch.from_numpy(img).permute(2, 0, 1)
    
    # Just the RGB stream now
    rgb = val_transform(img_tensor).unsqueeze(0).to(DEVICE)

    model = load_image_model()
    
    with torch.no_grad(), torch.amp.autocast("cuda"):
        outputs = model(rgb) # Outputs shape: (1, 2)
        
        # Apply softmax to convert raw logits to percentages
        probs = F.softmax(outputs, dim=1)
        
        # Class 0 is FAKE, Class 1 is REAL
        prob_fake = probs[0, 0].item()

    # Determine verdict based on threshold
    result = "FAKE" if prob_fake > IMAGE_THRESHOLD else "REAL"
    
    # Calculate display confidence
    confidence = prob_fake if result == "FAKE" else (1.0 - prob_fake)

    return {
        "result": result,
        "confidence": round(confidence * 100, 2),
        "score_raw": round(prob_fake, 6)
    }