import os
import re
import fitz  # PyMuPDF
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ─── Load model once at module level (not on every request) ───────────────
# Uses a lightweight BERT model — downloads ~90MB on first run
print("[TrustNet] Loading NLP model...")
NLP_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
print("[TrustNet] NLP model loaded ✓")


# ─── Text Extraction ──────────────────────────────────────────────────────

def extract_text(file_path: str) -> str:
    """Extract full text from PDF."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext != ".pdf":
        return ""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


def split_into_sentences(text: str) -> list:
    """Split text into individual sentences."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    # Filter: keep sentences with at least 6 words
    return [s.strip() for s in sentences if len(s.split()) >= 6]


# ─── Tense Inconsistency Detection ───────────────────────────────────────

PAST_TENSE_MARKERS = [
    "was", "were", "had", "did", "registered", "issued",
    "signed", "completed", "paid", "transferred", "sold",
    "approved", "granted", "executed", "dated"
]

FUTURE_TENSE_MARKERS = [
    "will", "shall", "would", "going to", "plans to",
    "intends to", "expected to", "scheduled to"
]


def detect_tense_inconsistency(sentences: list) -> list:
    """
    Detects sentences that mix future tense into
    what should be a historical document.
    """
    flags = []
    for s in sentences:
        s_lower = s.lower()
        has_future = any(marker in s_lower for marker in FUTURE_TENSE_MARKERS)
        has_past = any(marker in s_lower for marker in PAST_TENSE_MARKERS)

        if has_future and has_past:
            flags.append(
                f"⚠ Tense conflict detected: '{s[:120]}...'"
                if len(s) > 120 else f"⚠ Tense conflict: '{s}'"
            )
        elif has_future:
            flags.append(
                f"⚠ Future tense in historical document: '{s[:120]}'"
                if len(s) > 120 else f"⚠ Future tense found: '{s}'"
            )
    return flags


# ─── Semantic Coherence Check ─────────────────────────────────────────────

def detect_semantic_outliers(sentences: list) -> list:
    """
    Embeds all sentences and finds ones that are
    semantically very different from the document's
    overall topic — possible copy-paste insertions.
    """
    flags = []
    if len(sentences) < 5:
        return flags

    # Get embeddings for all sentences
    embeddings = NLP_MODEL.encode(sentences)

    # Compute mean document embedding (document centroid)
    centroid = np.mean(embeddings, axis=0, keepdims=True)

    # Compute each sentence's cosine similarity to centroid
    similarities = cosine_similarity(embeddings, centroid).flatten()

    # Flag sentences with very low similarity to document topic
    mean_sim = np.mean(similarities)
    std_sim = np.std(similarities)
    threshold = mean_sim - (2.0 * std_sim)

    for i, (sim, sent) in enumerate(zip(similarities, sentences)):
        if sim < threshold and sim < 0.15:
            short = sent[:120] + "..." if len(sent) > 120 else sent
            flags.append(
                f"⚠ Semantically inconsistent sentence detected "
                f"(similarity: {sim:.2f}): '{short}'"
            )

    return flags


# ─── Entity Extraction ────────────────────────────────────────────────────

def extract_entities(text: str) -> dict:
    """
    Extract key entities using regex patterns.
    Looks for names, amounts, dates, account numbers.
    """
    entities = {}

    # Indian mobile numbers
    mobiles = re.findall(r'\b[6-9]\d{9}\b', text)
    if mobiles:
        entities["mobile_numbers"] = list(set(mobiles))

    # PAN card pattern
    pan = re.findall(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b', text)
    if pan:
        entities["pan_numbers"] = list(set(pan))

    # Aadhaar pattern (12 digits)
    aadhaar = re.findall(r'\b\d{4}\s\d{4}\s\d{4}\b', text)
    if aadhaar:
        entities["aadhaar_numbers"] = list(set(aadhaar))

    # Currency amounts (Indian format)
    amounts = re.findall(r'₹\s?[\d,]+(?:\.\d{1,2})?|\bRs\.?\s?[\d,]+(?:\.\d{1,2})?', text)
    if amounts:
        entities["monetary_amounts"] = list(set(amounts[:20]))  # cap at 20

    # Email addresses
    emails = re.findall(r'\b[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}\b', text)
    if emails:
        entities["emails"] = list(set(emails))

    return entities


def check_entity_anomalies(entities: dict) -> list:
    """Flag suspicious entity patterns."""
    flags = []

    # Multiple PAN numbers in one document is suspicious
    if len(entities.get("pan_numbers", [])) > 2:
        flags.append(
            f"⚠ Multiple PAN numbers found ({len(entities['pan_numbers'])}) "
            f"— unusual for a single-person document"
        )

    # Multiple Aadhaar numbers
    if len(entities.get("aadhaar_numbers", [])) > 1:
        flags.append(
            f"⚠ Multiple Aadhaar numbers detected "
            f"— possible identity mixing"
        )

    return flags


# ─── Document Type Classifier ─────────────────────────────────────────────

DOCUMENT_TYPE_KEYWORDS = {
    "salary_slip": ["salary", "basic pay", "hra", "deduction", "net pay", "gross", "epf", "tds"],
    "bank_statement": ["balance", "credit", "debit", "transaction", "account", "ifsc", "statement"],
    "land_record": ["plot", "survey", "khata", "patta", "encumbrance", "registration", "land"],
    "legal_document": ["whereas", "hereinafter", "party", "agreement", "clause", "hereby", "executed"],
    "income_tax": ["assessment", "income tax", "itr", "pan", "ay ", "fy ", "taxable income"]
}


def classify_document_type(text: str) -> str:
    """Guess document type from keyword frequency."""
    text_lower = text.lower()
    scores = {}
    for doc_type, keywords in DOCUMENT_TYPE_KEYWORDS.items():
        scores[doc_type] = sum(1 for kw in keywords if kw in text_lower)

    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "unknown"


# ─── Main Entry Point ─────────────────────────────────────────────────────

def analyze_document_nlp(file_path: str) -> dict:
    """Main entry point for NLP semantic analysis."""
    text = extract_text(file_path)

    if not text or len(text.split()) < 20:
        return {
            "layer": "BERT NLP Semantic Analysis",
            "nlp_score": 0,
            "findings": ["Insufficient text for NLP analysis — skipping"],
            "risk_flag": False,
            "skipped": True
        }

    sentences = split_into_sentences(text)
    entities = extract_entities(text)
    doc_type = classify_document_type(text)

    # Run checks
    tense_flags = detect_tense_inconsistency(sentences)
    semantic_flags = detect_semantic_outliers(sentences)
    entity_flags = check_entity_anomalies(entities)

    all_findings = []

    # Document type identified
    all_findings.append(f"Document classified as: {doc_type.replace('_', ' ').title()}")

    # Entity summary
    if entities:
        for key, vals in entities.items():
            all_findings.append(f"Found {key.replace('_', ' ')}: {', '.join(vals[:3])}")

    all_findings += tense_flags + semantic_flags + entity_flags

    # Score
    warning_count = len(tense_flags) + len(semantic_flags) + len(entity_flags)

    if warning_count >= 4:
        nlp_score = 85
    elif warning_count == 3:
        nlp_score = 70
    elif warning_count == 2:
        nlp_score = 50
    elif warning_count == 1:
        nlp_score = 30
    else:
        nlp_score = 5

    return {
        "layer": "BERT NLP Semantic Analysis",
        "nlp_score": nlp_score,
        "document_type": doc_type,
        "entities_found": entities,
        "sentences_analyzed": len(sentences),
        "warnings_found": warning_count,
        "findings": all_findings,
        "risk_flag": nlp_score > 30
    }