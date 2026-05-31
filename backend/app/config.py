import os
import torch


os.environ["TF_FORCE_GPU_ALLOW_GROWTH"] = "true"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2" # Suppress TF info logs

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEIGHTS_DIR = os.path.join(BASE_DIR, "weights")

# Hardware Configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model Paths
FAKENEWS_MODEL_PATH = os.path.join(WEIGHTS_DIR, "fakenews_model.pkl")
TFIDF_VECTORIZER_PATH = os.path.join(WEIGHTS_DIR, "tfidf_vectorizer.pkl")
ROBERTA_MODEL_PATH = os.path.join(WEIGHTS_DIR, "roberta_fakenews")
IMAGE_MODEL_PATH = os.path.join(WEIGHTS_DIR, "deepfake_image_detector_b3_best.pth")

# UPDATED: Point to the new TensorFlow H5 weights
VIDEO_MODEL_PATH = os.path.join(WEIGHTS_DIR, "best_model.h5") 

# Core Constants
IMG_SIZE = 224
NUM_VIDEO_FRAMES = 15 # Matched to your new Kaggle inference logic
IMAGE_THRESHOLD = 0.5000  
VIDEO_THRESHOLD = 0.5000