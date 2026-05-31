import os
import uuid
import cv2
import numpy as np
import tensorflow as tf
from mtcnn import MTCNN
from functools import lru_cache
from app.config import VIDEO_MODEL_PATH, NUM_VIDEO_FRAMES, VIDEO_THRESHOLD

# Initialize the face detector globally so it doesn't reload on every request
detector = MTCNN()

@lru_cache()
def load_video_model():
    print("Loading TensorFlow Video Model into VRAM...")
    model = tf.keras.models.load_model(VIDEO_MODEL_PATH, compile=False)
    print("Video Model loaded successfully.")
    return model

def analyze_video_faces(video_bytes: bytes) -> dict:
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    temp_path = os.path.join(upload_dir, f"video_{uuid.uuid4().hex}.mp4")
    
    try:
        with open(temp_path, "wb") as f:
            f.write(video_bytes)
            
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise ValueError("OpenCV failed to open the video.")

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        if total_frames < 1:
            cap.release()
            raise ValueError("Video has no readable frames.")

        model = load_video_model()
        frame_indices = np.linspace(0, total_frames - 1, NUM_VIDEO_FRAMES, dtype=int)
        face_scores = []
        
        for idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if not ret: continue
                
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            try:
                results = detector.detect_faces(frame_rgb)
            except Exception:
                results = []
                
            if results:
                # Grab the most prominent face
                x, y, w, h = results[0]['box']
                
                # Apply 15% padding safety margin
                x1, y1 = max(0, x - int(w * 0.15)), max(0, y - int(h * 0.15))
                x2, y2 = min(width, x + w + int(w * 0.15)), min(height, y + h + int(h * 0.15))
                
                face_crop = frame[y1:y2, x1:x2]
                
                if face_crop.size > 0:
                    # Resize to EfficientNetB0 standard input size (224, 224)
                    face_crop = cv2.resize(face_crop, (224, 224))
                    img_array = tf.keras.preprocessing.image.img_to_array(face_crop)
                    img_array = np.expand_dims(img_array, axis=0)
                    preprocessed = tf.keras.applications.efficientnet.preprocess_input(img_array)
                    
                    # Predict
                    prob = model.predict(preprocessed, verbose=0)[0][0]
                    face_scores.append(float(prob))
                    
        cap.release()
        
        # Calculate final metrics
        if len(face_scores) == 0:
            raise ValueError("No clear faces could be detected in the uploaded video.")
            
        global_score = float(np.mean(face_scores))
        result = "FAKE" if global_score >= VIDEO_THRESHOLD else "REAL"
        confidence = global_score if result == "FAKE" else (1.0 - global_score)
        
        return {
            "result": result,
            "confidence": round(confidence * 100, 2),
            "score_raw": round(global_score, 6),
            "frames_used": len(face_scores) # Actual number of frames where a face was found
        }
        
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# Ensure the function name matches what the router expects
def predict_video(video_bytes: bytes) -> dict:
    return analyze_video_faces(video_bytes)