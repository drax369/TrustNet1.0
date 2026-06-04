from datetime import datetime


def aggregate_network_results(
    isolation: dict,
    lstm: dict,
    device: dict
) -> dict:
    """Combine all network layer scores into unified result."""

    isolation_score = isolation.get("isolation_score", 0)
    lstm_score      = lstm.get("lstm_score",      0)
    device_score    = device.get("device_score",  0)

    # Weighted network score
    # Isolation Forest: 40% | LSTM: 35% | Device: 25%
    network_score = round(
        (isolation_score * 0.40) +
        (lstm_score      * 0.35) +
        (device_score    * 0.25), 2
    )

    # Collect all warning flags
    all_flags = []
    for result in [isolation, lstm, device]:
        for f in result.get("findings", []):
            if "⚠" in f:
                all_flags.append(f)

    if network_score >= 60:
        risk_level = "HIGH RISK 🔴"
        action     = "BLOCK — Reject this request and flag IP for investigation"
    elif network_score >= 30:
        risk_level = "SUSPICIOUS 🟡"
        action     = "MONITOR — Allow with enhanced logging and manual review"
    else:
        risk_level = "CLEAN 🟢"
        action     = "ALLOW — Network behaviour appears normal"

    return {
        "layer":          "Network Behaviour Monitoring",
        "network_score":  network_score,
        "risk_level":     risk_level,
        "action":         action,
        "component_scores": {
            "isolation_forest": isolation_score,
            "lstm_sequence":    lstm_score,
            "device_fingerprint": device_score
        },
        "flags":          all_flags,
        "risk_flag":      network_score >= 30,
        "analyzed_at":    datetime.now().isoformat()
    }