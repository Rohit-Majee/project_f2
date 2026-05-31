import torch
import torch.nn as nn
import torch.nn.functional as F
import timm

class TemporalAttention(nn.Module):
    def __init__(self, hidden_dim: int):
        super().__init__()
        self.attn = nn.Linear(hidden_dim, 1)

    def forward(self, gru_out):
        scores = self.attn(gru_out).squeeze(-1)
        weights = F.softmax(scores, dim=-1).unsqueeze(-1)
        return (gru_out * weights).sum(dim=1)

class DualStreamVideoDetector(nn.Module):
    def __init__(self, gru_hidden=512, gru_layers=2):
        super().__init__()
        self.rgb_backbone = timm.create_model("tf_efficientnetv2_s", pretrained=False, num_classes=0, global_pool="avg")
        self.freq_backbone = timm.create_model("tf_efficientnet_b1", pretrained=False, num_classes=0, global_pool="avg")
        
        self.rgb_gru = nn.GRU(self.rgb_backbone.num_features, gru_hidden, num_layers=gru_layers, batch_first=True, bidirectional=True, dropout=0.3)
        self.freq_gru = nn.GRU(self.freq_backbone.num_features, gru_hidden, num_layers=gru_layers, batch_first=True, bidirectional=True, dropout=0.3)
        
        self.rgb_attn = TemporalAttention(gru_hidden * 2)
        self.freq_attn = TemporalAttention(gru_hidden * 2)
        
        fused_dim = gru_hidden * 4 
        self.classifier = nn.Sequential(
            nn.LayerNorm(fused_dim),
            nn.Dropout(0.5),
            nn.Linear(fused_dim, 256),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
        )

    def _encode_stream(self, frames, backbone, gru, attn):
        B, T, C, H, W = frames.shape
        flat = frames.view(B * T, C, H, W)
        feats = backbone(flat).view(B, T, -1)
        gru_out, _ = gru(feats)
        return attn(gru_out)

    def forward(self, rgb, freq):
        rgb_ctx = self._encode_stream(rgb, self.rgb_backbone, self.rgb_gru, self.rgb_attn)
        freq_ctx = self._encode_stream(freq, self.freq_backbone, self.freq_gru, self.freq_attn)
        fused = torch.cat([rgb_ctx, freq_ctx], dim=-1)
        return self.classifier(fused).squeeze(-1)