# 🛡️ Fake News and Deepfake Detection System

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-ee4c2c?logo=pytorch)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)

An end-to-end, full-stack forensic AI platform designed to detect digital misinformation. This project leverages a highly responsive **React (Vite)** frontend and an optimized **FastAPI/PyTorch** backend to analyze text-based fake news, synthetic deepfake images, and manipulated deepfake videos.

---

## 🚀 Key Features

* **Multi-Modal Analysis:** A unified pipeline capable of processing textual articles, static images, and sequential video frames.
* **Deepfake Image Detection:** Utilizes an `EfficientNet` backbone combined with spatial feature extraction and Error Level Analysis (ELA) to detect GAN and Diffusion model artifacts.
* **Temporal Video Forensics:** Video classification powered by Spatial-Temporal networks (Bidirectional GRUs + Temporal Attention) to identify frame-to-frame inconsistencies and temporal flickering.
* **Comparative NLP Engines:** Dynamic text routing allows users to evaluate news using either Traditional Machine Learning (TF-IDF + SVM) or state-of-the-art Deep Learning (`RoBERTa` sequence classification).
* **VRAM-Optimized Inference:** Engineered specifically for efficient GPU execution using dynamic lazy-loading caching, in-memory OpenCV frame extraction, and ultra-fast dependency management via `uv`.

---

## 🏗️ System Architecture

This system utilizes a clean **Router-Service-Model** pattern on the backend, ensuring a strict decoupling of API endpoints, inference pipelines, and neural network definitions.

```text
project-root/
│
├── frontend/                   # ── UI LAYER (React + Vite) ──
│   ├── src/                    # Components, Pages, and Hooks
│   ├── package.json            # npm dependencies
│   └── vite.config.js
│
└── backend/                    # ── API & AI LAYER (FastAPI) ──
    ├── .venv/                  # Managed by uv
    ├── pyproject.toml          # uv configuration and Python dependencies
    ├── uv.lock                 # Deterministic dependency lockfile
    │
    ├── app/                    # Core Application Logic
    │   ├── main.py             # FastAPI instance, CORS, and Router registration
    │   ├── config.py           # Global paths, CUDA device config, and thresholds
    │   ├── models/             # PyTorch Neural Network Class Definitions
    │   │   ├── image_model.py  # DualStreamImageDetector (EfficientNet)
    │   │   └── video_model.py  # DualStreamVideoDetector (GRU + Attention)
    │   ├── services/           # Inference Pipelines & Preprocessing
    │   │   ├── fakenews_service.py
    │   │   ├── image_service.py
    │   │   └── video_service.py
    │   └── routers/            # API Endpoints
    │       ├── fakenews_router.py
    │       └── deepfake_router.py
    │
    └── weights/                # ── SAVED MODELS (Ignored in Git) ──
        ├── fakenews_model.pkl
        ├── tfidf_vectorizer.pkl
        ├── roberta_fakenews/
        ├── best_deepfake_image_detector.pth
        └── best_deepfake_detector.pth
```

## ⚙️ Installation & Local Setup

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.12+ (for backend)
- uv package manager (`pip install uv`)
- NVIDIA GPU with CUDA support (Recommended for PyTorch inference)

### 1. Backend Setup (FastAPI + PyTorch)

```bash
cd backend

# Initialize the environment and install all dependencies from uv.lock
uv sync

# Ensure all your pre-trained models are placed in the backend/weights/ directory!

# Start the FastAPI server
uv run uvicorn app.main:app --reload
```

### 2. Frontend Setup (React/Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Configure environment variables
echo "VITE_BASE_URL=http://localhost:8000/api" > .env

# Start the development server
npm run dev
```

## 📡 API Reference

### POST /api/fakenews

Analyzes text for misinformation.

**Payload**

```json
{
  "text": "News content...",
  "model_choice": "roberta"
}
```

**Returns**

- Verification Verdict
- Confidence Score (%)
- Model Engine Used

### POST /api/deepfake

Analyzes media for generative manipulation.

**Payload**

`multipart/form-data` containing:

- file (Bytes)
- type (`image` | `video`)

**Returns**

- Verification Verdict
- Confidence Score (%)
- Raw Anomaly Score
- Frames Analyzed (for video)
- ELA Heatmap generation (for images)

## 🛡️ Academic Context & Acknowledgements

Developed as an advanced engineering system for Information Technology curriculum applications.

Features integrated Test-Time Augmentation (TTA) and Explainable AI (XAI) concepts.
