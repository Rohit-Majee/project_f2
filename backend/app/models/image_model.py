import torch.nn as nn
import timm

def get_image_model():
    # Matches the architecture from your Kaggle notebook
    # pretrained=False because we will load your trained weights
    model = timm.create_model('efficientnet_b3', pretrained=False, num_classes=2)
    return model