import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime
import hashlib


# ─── Isolation Forest Model ───────────────────────────────────────────────
# Trained on synthetic "normal" traffic patterns.
# In production this would be trained on real bank traffic logs.

def build_baseline_model() -> IsolationForest:
    """
    Build and fit Isolation Forest on synthetic normal traffic.
    Normal pattern: small files, human upload speeds, known IPs.
    """
    np.random.seed(42)
    n = 500

    # Simulate normal traffic features:
    # [file_size_mb, upload_duration_sec, files_per_session,
    #  request_interval_sec, hour_of_day]
    normal_data = np.column_stack([
        np.random.normal(2.5, 1.0, n).clip(0.1, 10),    # file size 0.1-10MB
        np.random.normal(8.0, 3.0, n).clip(1, 30),       # upload 1-30s
        np.random.randint(1, 6, n).astype(float),         # 1-5 files/session
        np.random.normal(30, 15, n).clip(5, 120),         # 5-120s between requests
        np.random.randint(8, 18, n).astype(float),        # 8am-6pm working hours
    ])

    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,   # expect 5% anomalies
        random_state=42
    )
    model.fit(normal_data)
    return model


# Load model once at module level
print("[TrustNet] Loading Isolation Forest model...")
ISOLATION_MODEL = build_baseline_model()
print("[TrustNet] Isolation Forest ready ✓")


# ─── Feature Extraction ───────────────────────────────────────────────────

def extract_traffic_features(request_meta: dict) -> np.ndarray:
    """
    Convert raw request metadata into feature vector.
    Expected keys in request_meta:
      - file_size_mb      : float
      - upload_duration_sec: float
      - files_in_session  : int
      - request_interval_sec: float (time since last request from this IP)
      - hour_of_day       : int (0-23)
    """
    return np.array([[
        float(request_meta.get("file_size_mb",          1.0)),
        float(request_meta.get("upload_duration_sec",   5.0)),
        float(request_meta.get("files_in_session",      1)),
        float(request_meta.get("request_interval_sec",  30.0)),
        float(request_meta.get("hour_of_day",
              datetime.now().hour)),
    ]])


def run_isolation_forest(features: np.ndarray) -> dict:
    """Run Isolation Forest and return anomaly score."""
    prediction    = ISOLATION_MODEL.predict(features)
    anomaly_score = ISOLATION_MODEL.score_samples(features)[0]

    normalised = max(0, min(100,
        round((abs(float(anomaly_score)) - 0.3) / 0.4 * 100, 2)
    ))

    # Force Python native bool — fixes JSON serialization error
    is_anomaly = bool(prediction[0] == -1)

    return {
        "is_anomaly":      is_anomaly,
        "raw_score":       round(float(anomaly_score), 4),
        "isolation_score": float(normalised),
        "finding": (
            "⚠ Isolation Forest: Anomalous traffic pattern detected"
            if is_anomaly else
            "✓ Traffic pattern within normal range"
        )
    }