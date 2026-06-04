from datetime import datetime


# ─── Weight Configuration ─────────────────────────────────────────────────
# These weights determine each layer's contribution to the final score.
# Adjust here if you want to re-tune sensitivity.

LAYER_WEIGHTS = {
    "ela":      0.20,   # Pixel-level forgery
    "benfords": 0.25,   # Financial figure fabrication (highest weight)
    "metadata": 0.20,   # Document tampering timeline
    "nlp":      0.15,   # Semantic inconsistency
    "gnn":      0.20,   # Cross-document contradictions
}

# Risk thresholds
THRESHOLD_HIGH       = 60
THRESHOLD_SUSPICIOUS = 30


# ─── Score Extraction ─────────────────────────────────────────────────────

def extract_layer_scores(layers: dict) -> dict:
    """Pull the numeric score from each layer result."""
    return {
        "ela":      layers.get("ela",      {}).get("overall_ela_score", 0),
        "benfords": 0 if layers.get("benfords", {}).get("skipped")
                      else layers.get("benfords", {}).get("benfords_score", 0),
        "metadata": layers.get("metadata", {}).get("metadata_score",    0),
        "nlp":      0 if layers.get("nlp",      {}).get("skipped")
                      else layers.get("nlp",      {}).get("nlp_score",  0),
        "gnn":      0 if layers.get("gnn",      {}).get("skipped")
                      else layers.get("gnn",      {}).get("gnn_score",  0),
    }


def compute_weighted_score(layer_scores: dict) -> float:
    """Compute the final weighted risk score (0-100)."""
    total = sum(
        layer_scores[layer] * weight
        for layer, weight in LAYER_WEIGHTS.items()
        if layer in layer_scores
    )
    return round(min(total, 100), 2)


# ─── Risk Classification ──────────────────────────────────────────────────

def classify_risk(score: float) -> dict:
    """Return risk level, colour, and recommended action."""
    if score >= THRESHOLD_HIGH:
        return {
            "level":       "HIGH RISK",
            "emoji":       "🔴",
            "colour":      "red",
            "action":      "HOLD — Do not process. Escalate immediately to fraud team.",
            "urgency":     "Immediate action required"
        }
    elif score >= THRESHOLD_SUSPICIOUS:
        return {
            "level":       "SUSPICIOUS",
            "emoji":       "🟡",
            "colour":      "amber",
            "action":      "REVIEW — Flag for senior officer review before proceeding.",
            "urgency":     "Review within 24 hours"
        }
    else:
        return {
            "level":       "CLEAN",
            "emoji":       "🟢",
            "colour":      "green",
            "action":      "PROCEED — No significant anomalies detected.",
            "urgency":     "No action required"
        }


# ─── Flag Collector & Prioritiser ────────────────────────────────────────

LAYER_DISPLAY_NAMES = {
    "ela":      "Pixel Forensics (ELA)",
    "benfords": "Financial Figure Analysis",
    "metadata": "Document Metadata",
    "nlp":      "Semantic Text Analysis",
    "gnn":      "Cross-Document Comparison"
}


def collect_prioritised_flags(layers: dict, layer_scores: dict) -> list:
    """
    Collect all warning flags across layers.
    Sort by layer score descending — highest risk flags first.
    """
    all_flags = []

    for layer_key, result in layers.items():
        if result.get("skipped"):
            continue

        score       = layer_scores.get(layer_key, 0)
        layer_name  = LAYER_DISPLAY_NAMES.get(layer_key, layer_key.upper())
        risk_flag   = result.get("risk_flag", False)

        for finding in result.get("findings", []):
            if "⚠" in finding:
                all_flags.append({
                    "layer":      layer_name,
                    "layer_key":  layer_key,
                    "score":      score,
                    "flag":       finding.replace("⚠", "").strip(),
                    "severity":   "high"   if score >= 60
                                  else "medium" if score >= 30
                                  else "low"
                })
            elif risk_flag and "✓" not in finding:
                # Include non-warning findings from flagged layers
                all_flags.append({
                    "layer":      layer_name,
                    "layer_key":  layer_key,
                    "score":      score,
                    "flag":       finding.strip(),
                    "severity":   "info"
                })

    # Sort: high severity first, then by score descending
    severity_order = {"high": 0, "medium": 1, "low": 2, "info": 3}
    all_flags.sort(key=lambda x: (severity_order.get(x["severity"], 4), -x["score"]))

    return all_flags


# ─── Plain-English Explanation Generator ─────────────────────────────────

LAYER_EXPLANATIONS = {
    "ela": (
        "The document image shows signs of pixel-level manipulation. "
        "When a document is edited digitally, the altered regions compress "
        "differently from the original — our analysis detected these "
        "differences."
    ),
    "benfords": (
        "The financial figures in this document do not follow the natural "
        "distribution of real-world numbers (Benford's Law). "
        "Genuine financial data — salaries, balances, transaction amounts — "
        "follows a predictable pattern. These numbers deviate significantly, "
        "suggesting they may have been fabricated."
    ),
    "metadata": (
        "The hidden metadata inside this document contradicts what the "
        "document claims. Every digital file carries timestamps and "
        "software information that reveals when and how it was created "
        "or modified."
    ),
    "nlp": (
        "The text content of the document contains semantic inconsistencies "
        "— language patterns, tense usage, or entity references that are "
        "unusual or contradictory for the claimed document type."
    ),
    "gnn": (
        "Comparing this document against others submitted by the same "
        "applicant reveals contradictions — different employer names, "
        "identity numbers, or financial figures that should match "
        "across documents."
    )
}


def generate_plain_english_summary(
    score: float,
    risk_info: dict,
    prioritised_flags: list,
    layer_scores: dict,
    filename: str,
    layers: dict
) -> str:
    """
    Generate a complete plain-English explanation
    that any bank officer can read and act on.
    """
    lines = []

    # Header
    lines.append(
        f"TRUSTNET ANALYSIS REPORT — {filename}"
    )
    lines.append(
        f"Generated: {datetime.now().strftime('%d %b %Y, %H:%M')}"
    )
    lines.append("─" * 50)

    # Verdict
    lines.append(
        f"\nVERDICT: {risk_info['level']} {risk_info['emoji']}"
    )
    lines.append(f"Risk Score: {score}/100")
    lines.append(f"Recommended Action: {risk_info['action']}")

    # High-severity flags
    high_flags = [f for f in prioritised_flags
                  if f["severity"] in ("high", "medium")]

    if high_flags:
        lines.append(f"\nKEY RED FLAGS ({len(high_flags)} found):")
        for i, flag in enumerate(high_flags[:8], 1):  # cap at 8
            lines.append(f"  {i}. [{flag['layer']}] {flag['flag']}")
    else:
        lines.append("\nNo significant red flags detected.")

    # Layer-by-layer breakdown
    lines.append("\nLAYER BREAKDOWN:")
    for layer_key, display_name in LAYER_DISPLAY_NAMES.items():
        s = layer_scores.get(layer_key, 0)
        result = layers.get(layer_key, {})

        if result.get("skipped"):
            status = "— (skipped — insufficient data)"
        elif s >= 60:
            status = f"HIGH ({s}/100) 🔴"
        elif s >= 30:
            status = f"SUSPICIOUS ({s}/100) 🟡"
        else:
            status = f"Clean ({s}/100) 🟢"

        lines.append(f"  • {display_name}: {status}")

        # Add explanation only for flagged layers
        if s >= 30 and not result.get("skipped"):
            explanation = LAYER_EXPLANATIONS.get(layer_key, "")
            if explanation:
                # Wrap at 65 chars
                words = explanation.split()
                line, wrapped = "    ", []
                for w in words:
                    if len(line) + len(w) > 65:
                        wrapped.append(line)
                        line = "    " + w + " "
                    else:
                        line += w + " "
                wrapped.append(line)
                lines.extend(wrapped)

    lines.append("\n" + "─" * 50)
    lines.append(
        "This report was generated automatically by TrustNet AI. "
        "All flagged items should be verified by a qualified officer "
        "before any action is taken."
    )

    return "\n".join(lines)


# ─── Layer Health Summary ─────────────────────────────────────────────────

def get_layer_health(layers: dict, layer_scores: dict) -> list:
    """Returns a clean status summary for each layer."""
    health = []
    for layer_key, display_name in LAYER_DISPLAY_NAMES.items():
        result = layers.get(layer_key, {})
        score  = layer_scores.get(layer_key, 0)

        health.append({
            "layer":        display_name,
            "layer_key":    layer_key,
            "score":        score,
            "risk_flag":    result.get("risk_flag", False),
            "skipped":      result.get("skipped", False),
            "status":       "skipped"     if result.get("skipped")
                            else "high"   if score >= 60
                            else "medium" if score >= 30
                            else "clean"
        })

    return health


# ─── Master Aggregator ────────────────────────────────────────────────────

def aggregate_results(
    filename:  str,
    layers:    dict
) -> dict:
    """
    Master function — takes all layer results,
    computes final score, and builds the complete report.
    """
    layer_scores        = extract_layer_scores(layers)
    combined_score      = compute_weighted_score(layer_scores)
    risk_info           = classify_risk(combined_score)
    prioritised_flags   = collect_prioritised_flags(layers, layer_scores)
    plain_english       = generate_plain_english_summary(
                              combined_score, risk_info,
                              prioritised_flags, layer_scores,
                              filename, layers
                          )
    layer_health        = get_layer_health(layers, layer_scores)

    # Count active risk flags
    flags_high   = sum(1 for f in prioritised_flags if f["severity"] == "high")
    flags_medium = sum(1 for f in prioritised_flags if f["severity"] == "medium")

    return {
        "filename":            filename,
        "combined_risk_score": combined_score,
        "risk_level":          f"{risk_info['level']} {risk_info['emoji']}",
        "risk_colour":         risk_info["colour"],
        "recommended_action":  risk_info["action"],
        "urgency":             risk_info["urgency"],
        "flags_summary": {
            "total_flags":   len(prioritised_flags),
            "high_severity": flags_high,
            "medium_severity": flags_medium,
        },
        "layer_scores":        layer_scores,
        "layer_health":        layer_health,
        "prioritised_flags":   prioritised_flags,
        "plain_english_report": plain_english,
        "generated_at":        datetime.now().isoformat()
    }