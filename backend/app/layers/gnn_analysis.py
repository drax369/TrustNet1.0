import os
import re
import fitz
import networkx as nx
from itertools import combinations


# ─── Text Extraction ──────────────────────────────────────────────────────

def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext != ".pdf":
        return ""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


# ─── Entity Extractors ────────────────────────────────────────────────────

def extract_names(text: str) -> list:
    """Extract likely person names (capitalized word pairs)."""
    pattern = r'\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})\b'
    candidates = re.findall(pattern, text)
    # Filter out common non-name capitalized phrases
    stop_phrases = {
        "National Bank", "Canara Bank", "State Bank", "Reserve Bank",
        "Income Tax", "Provident Fund", "Bank Statement", "Salary Slip",
        "Land Record", "Legal Document", "Indian Rupees"
    }
    return list({n for n in candidates if n not in stop_phrases})


def extract_employers(text: str) -> list:
    """Extract employer/company names."""
    patterns = [
        r'(?:employer|company|organisation|organization|firm)\s*[:\-]?\s*([A-Za-z\s\.\&]+?)(?:\n|,|\.)',
        r'([A-Z][A-Za-z\s]+(?:Pvt\.?\s*Ltd\.?|Ltd\.?|Inc\.?|LLP|Corp\.?))',
    ]
    found = []
    for p in patterns:
        matches = re.findall(p, text, re.IGNORECASE)
        found.extend([m.strip() for m in matches if len(m.strip()) > 3])
    return list(set(found))


def extract_amounts(text: str) -> list:
    """Extract monetary amounts."""
    patterns = re.findall(
        r'(?:₹|Rs\.?)\s?[\d,]+(?:\.\d{1,2})?|\b\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?\b',
        text
    )
    cleaned = []
    for p in patterns:
        val = re.sub(r'[₹Rs,\s]', '', p)
        try:
            cleaned.append(float(val))
        except ValueError:
            pass
    return cleaned


def extract_dates(text: str) -> list:
    """Extract dates in common Indian document formats."""
    patterns = [
        r'\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b',
        r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
        r'[\s\-]\d{1,2}[\s,\-]\d{4}\b',
        r'\b\d{1,2}\s(?:January|February|March|April|May|June|July|'
        r'August|September|October|November|December)\s\d{4}\b'
    ]
    found = []
    for p in patterns:
        found.extend(re.findall(p, text, re.IGNORECASE))
    return list(set(found))


def extract_pan(text: str) -> list:
    return list(set(re.findall(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b', text)))


def extract_aadhaar(text: str) -> list:
    return list(set(re.findall(r'\b\d{4}\s\d{4}\s\d{4}\b', text)))


def extract_account_numbers(text: str) -> list:
    """Extract bank account numbers (10-18 digits)."""
    found = re.findall(r'\b\d{10,18}\b', text)
    # Filter out obvious non-account numbers
    return list(set([
        f for f in found
        if not re.match(r'^(19|20)\d{6}', f)  # not a date
    ]))


# ─── Build Document Entity Profile ───────────────────────────────────────

def build_entity_profile(file_path: str, doc_id: str) -> dict:
    """Extract all entities from a document into a profile dict."""
    text = extract_text(file_path)
    if not text:
        return {"doc_id": doc_id, "file": os.path.basename(file_path), "empty": True}

    return {
        "doc_id":           doc_id,
        "file":             os.path.basename(file_path),
        "text_length":      len(text),
        "names":            extract_names(text),
        "employers":        extract_employers(text),
        "amounts":          extract_amounts(text),
        "dates":            extract_dates(text),
        "pan_numbers":      extract_pan(text),
        "aadhaar_numbers":  extract_aadhaar(text),
        "account_numbers":  extract_account_numbers(text),
    }


# ─── Graph Construction ───────────────────────────────────────────────────

def build_document_graph(profiles: list) -> nx.Graph:
    """
    Build a NetworkX graph where:
    - Nodes = documents
    - Edges = shared entities between documents
    Edge weight = number of shared entities
    """
    G = nx.Graph()

    # Add document nodes
    for p in profiles:
        G.add_node(p["doc_id"], **{k: v for k, v in p.items()
                                    if k != "doc_id"})

    # Add edges for shared entities
    for p1, p2 in combinations(profiles, 2):
        shared = {}

        for field in ["names", "employers", "pan_numbers",
                      "aadhaar_numbers", "account_numbers"]:
            s1 = set(str(x) for x in p1.get(field, []))
            s2 = set(str(x) for x in p2.get(field, []))
            common = s1 & s2
            if common:
                shared[field] = list(common)

        if shared:
            G.add_edge(p1["doc_id"], p2["doc_id"],
                       shared=shared,
                       weight=len(shared))

    return G


# ─── Contradiction Detection ──────────────────────────────────────────────

def detect_contradictions(profiles: list) -> list:
    """
    Compare entity profiles across all document pairs.
    Flag fields that have conflicting values.
    """
    flags = []

    for p1, p2 in combinations(profiles, 2):
        doc_pair = f"'{p1['file']}' vs '{p2['file']}'"

        # Check employer contradictions
        emp1 = set(e.lower().strip() for e in p1.get("employers", []))
        emp2 = set(e.lower().strip() for e in p2.get("employers", []))
        if emp1 and emp2 and emp1 != emp2 and not (emp1 & emp2):
            flags.append(
                f"⚠ Employer mismatch between {doc_pair}: "
                f"{p1.get('employers', [])} vs {p2.get('employers', [])}"
            )

        # Check PAN contradictions (same person should have same PAN)
        pan1 = set(p1.get("pan_numbers", []))
        pan2 = set(p2.get("pan_numbers", []))
        if pan1 and pan2 and not (pan1 & pan2):
            flags.append(
                f"⚠ Different PAN numbers across {doc_pair}: "
                f"{pan1} vs {pan2} — possible identity fraud"
            )

        # Check Aadhaar contradictions
        aadh1 = set(p1.get("aadhaar_numbers", []))
        aadh2 = set(p2.get("aadhaar_numbers", []))
        if aadh1 and aadh2 and not (aadh1 & aadh2):
            flags.append(
                f"⚠ Different Aadhaar numbers across {doc_pair}: "
                f"{aadh1} vs {aadh2}"
            )

        # Check for very different salary amounts
        amt1 = p1.get("amounts", [])
        amt2 = p2.get("amounts", [])
        if amt1 and amt2:
            max1 = max(amt1)
            max2 = max(amt2)
            if max1 > 0 and max2 > 0:
                ratio = max(max1, max2) / min(max1, max2)
                if ratio > 10:
                    flags.append(
                        f"⚠ Large amount discrepancy between {doc_pair}: "
                        f"₹{max1:,.0f} vs ₹{max2:,.0f} — "
                        f"{ratio:.1f}x difference is suspicious"
                    )

    return flags


def detect_isolated_documents(G: nx.Graph, profiles: list) -> list:
    """Flag documents that share NO entities with any other document."""
    flags = []
    for p in profiles:
        doc_id = p["doc_id"]
        if G.degree(doc_id) == 0 and len(profiles) > 1:
            flags.append(
                f"⚠ '{p['file']}' shares no common entities with "
                f"other submitted documents — may be from a different person"
            )
    return flags


# ─── Graph Stats ──────────────────────────────────────────────────────────

def compute_graph_stats(G: nx.Graph) -> dict:
    """Compute basic graph statistics for the report."""
    if len(G.nodes) == 0:
        return {}
    return {
        "total_documents":  len(G.nodes),
        "total_edges":      len(G.edges),
        "connected":        nx.is_connected(G) if len(G.nodes) > 1 else True,
        "avg_degree":       round(
            sum(d for _, d in G.degree()) / len(G.nodes), 2
        )
    }


# ─── Main Entry Point ─────────────────────────────────────────────────────

def analyze_documents_gnn(file_paths: list) -> dict:
    """
    Main entry point — accepts a list of file paths.
    Builds entity graph and detects cross-document contradictions.
    """
    if len(file_paths) < 2:
        return {
            "layer":     "Graph Neural Network — Cross-Document Analysis",
            "gnn_score": 0,
            "findings":  [
                "Only one document submitted — "
                "GNN requires at least 2 documents to compare"
            ],
            "risk_flag": False,
            "skipped":   True
        }

    # Build entity profiles for each document
    profiles = []
    for i, fp in enumerate(file_paths):
        profile = build_entity_profile(fp, doc_id=f"doc_{i+1}")
        profiles.append(profile)

    # Build graph
    G = build_document_graph(profiles)

    # Run contradiction checks
    contradiction_flags = detect_contradictions(profiles)
    isolation_flags     = detect_isolated_documents(G, profiles)
    graph_stats         = compute_graph_stats(G)

    all_flags    = contradiction_flags + isolation_flags
    warning_count = len(all_flags)

    # Build entity summary per document
    doc_summaries = []
    for p in profiles:
        doc_summaries.append({
            "document":        p["file"],
            "names_found":     p.get("names", [])[:5],
            "employers_found": p.get("employers", [])[:3],
            "pan_found":       p.get("pan_numbers", []),
            "aadhaar_found":   p.get("aadhaar_numbers", []),
            "amounts_found":   [f"₹{a:,.0f}" for a in
                                sorted(p.get("amounts", []),
                                reverse=True)[:5]],
            "dates_found":     p.get("dates", [])[:5],
        })

    # Score
    if warning_count >= 3:
        gnn_score = 90
    elif warning_count == 2:
        gnn_score = 70
    elif warning_count == 1:
        gnn_score = 50
    else:
        gnn_score = 0

    findings = []
    if not all_flags:
        findings.append(
            "✓ No cross-document contradictions detected — "
            "entities are consistent across all submitted documents"
        )
    else:
        findings = all_flags

    return {
        "layer":            "Graph Neural Network — Cross-Document Analysis",
        "gnn_score":        gnn_score,
        "graph_stats":      graph_stats,
        "document_profiles": doc_summaries,
        "warnings_found":   warning_count,
        "findings":         findings,
        "risk_flag":        gnn_score > 30
    }