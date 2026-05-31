import re
import string
import pickle
import numpy as np
import torch
from functools import lru_cache
from transformers import RobertaForSequenceClassification, RobertaTokenizer
from app.config import DEVICE, FAKENEWS_MODEL_PATH, TFIDF_VECTORIZER_PATH, ROBERTA_MODEL_PATH

@lru_cache()
def load_traditional_models():
    with open(FAKENEWS_MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(TFIDF_VECTORIZER_PATH, "rb") as f:
        tfidf = pickle.load(f)
    return model, tfidf

@lru_cache()
def load_roberta_model():
    tokenizer = RobertaTokenizer.from_pretrained(ROBERTA_MODEL_PATH)
    model = RobertaForSequenceClassification.from_pretrained(ROBERTA_MODEL_PATH).to(DEVICE).eval()
    return tokenizer, model

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\d+", "", text)
    return re.sub(r"\s+", " ", text).strip()

def predict_traditional(text: str):
    model, tfidf = load_traditional_models()
    cleaned = clean_text(text)
    vector = tfidf.transform([cleaned])
    
    pred = model.predict(vector)[0]
    try:
        conf = float(model.predict_proba(vector)[0][pred])
    except AttributeError:
        raw = model.decision_function(vector)[0]
        prob = 1 / (1 + np.exp(-raw))
        conf = prob if pred == 1 else 1 - prob

    return "FAKE NEWS" if pred == 1 else "REAL NEWS", conf

def predict_roberta(text: str):
    tokenizer, model = load_roberta_model()
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=256, padding=True).to(DEVICE)

    with torch.no_grad():
        outputs = model(**inputs)
    
    probs = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]
    pred = np.argmax(probs)
    return "FAKE NEWS" if pred == 1 else "REAL NEWS", float(probs[pred])