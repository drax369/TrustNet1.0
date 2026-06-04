import numpy as np
from collections import defaultdict
from datetime import datetime

# ─── In-memory session store ──────────────────────────────────────────────
# Tracks upload sequences per IP address.
# In production: replace with Redis.
SESSION_STORE = defaultdict(list)


def record_request(ip: str, timestamp: float, file_size_mb: float):
    """Record an upload event for an IP address."""
    SESSION_STORE[ip].append({
        "timestamp":    timestamp,
        "file_size_mb": file_size_mb
    })
    # Keep only last 20 events per IP
    SESSION_STORE[ip] = SESSION_STORE[ip][-20:]


def analyze_upload_sequence(ip: str) -> dict:
    """
    Analyse the upload sequence for an IP.
    Detects bot-like patterns: too fast, too uniform, too many files.
    """
    events = SESSION_STORE.get(ip, [])
    findings = []
    lstm_score = 0

    if len(events) < 2:
        return {
            "lstm_score": 0,
            "events_analyzed": len(events),
            "findings": ["Insufficient session history for sequence analysis"],
            "risk_flag": False
        }

    timestamps  = [e["timestamp"]    for e in events]
    file_sizes  = [e["file_size_mb"] for e in events]
    intervals   = [timestamps[i+1] - timestamps[i]
                   for i in range(len(timestamps)-1)]

    # Check 1: Suspiciously fast uploads (bot-speed)
    avg_interval = np.mean(intervals)
    if avg_interval < 2.0 and len(events) >= 3:
        findings.append(
            f"⚠ Uploads averaging {avg_interval:.1f}s apart "
            f"— bot-like upload speed detected"
        )
        lstm_score += 40

    # Check 2: Too many files in short time
    time_span = timestamps[-1] - timestamps[0]
    if len(events) >= 5 and time_span < 60:
        findings.append(
            f"⚠ {len(events)} files uploaded in {time_span:.0f}s "
            f"— abnormal volume for human behaviour"
        )
        lstm_score += 35

    # Check 3: Unnaturally uniform file sizes (automated generation)
    if len(file_sizes) >= 4:
        std_size = np.std(file_sizes)
        if std_size < 0.05:
            findings.append(
                f"⚠ All files are nearly identical size "
                f"({np.mean(file_sizes):.2f}MB ± {std_size:.3f}MB) "
                f"— suggests automated document generation"
            )
            lstm_score += 25

    # Check 4: Off-hours activity
    hour = datetime.fromtimestamp(timestamps[-1]).hour
    if hour < 6 or hour > 22:
        findings.append(
            f"⚠ Upload activity at {hour:02d}:00 "
            f"— outside normal banking hours"
        )
        lstm_score += 20

    if not findings:
        findings.append(
            "✓ Upload sequence appears human — no bot-like patterns detected"
        )

    return {
        "lstm_score":      min(lstm_score, 100),
        "events_analyzed": len(events),
        "avg_interval_sec": round(avg_interval, 2) if intervals else 0,
        "findings":        findings,
        "risk_flag":       lstm_score >= 30
    }