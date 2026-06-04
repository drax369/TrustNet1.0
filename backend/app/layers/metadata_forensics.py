import os
import fitz  # PyMuPDF
import re
from datetime import datetime, timezone
from dateutil import parser as dateparser
from PIL import Image
from PIL.ExifTags import TAGS


# ─── PDF Metadata Extraction ───────────────────────────────────────────────

def extract_pdf_metadata(file_path: str) -> dict:
    """Extract all metadata fields from a PDF file."""
    doc = fitz.open(file_path)
    raw_meta = doc.metadata
    doc.close()

    cleaned = {}
    for key, value in raw_meta.items():
        if value and str(value).strip():
            cleaned[key] = str(value).strip()

    return cleaned


# ─── Image EXIF Extraction ─────────────────────────────────────────────────

def extract_image_metadata(file_path: str) -> dict:
    """Extract EXIF metadata from image files."""
    try:
        img = Image.open(file_path)
        exif_data = img._getexif()
        if not exif_data:
            return {}
        readable = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            readable[str(tag)] = str(value)
        return readable
    except Exception:
        return {}


# ─── Date Parsing ──────────────────────────────────────────────────────────

def parse_pdf_date(date_str: str):
    """
    Parse PDF date format: D:20210314120000+05'30'
    Returns a datetime object or None.
    """
    if not date_str:
        return None
    try:
        # Strip PDF date prefix
        clean = date_str.replace("D:", "").strip()
        # Extract just the datetime part
        clean = re.sub(r"[Z\+\-]\d{2}'\d{2}'.*$", "", clean)
        clean = re.sub(r"[Z\+\-]\d{4}$", "", clean)
        clean = clean[:14]  # YYYYMMDDHHmmss
        if len(clean) >= 8:
            return datetime.strptime(clean[:14].ljust(14, "0"), "%Y%m%d%H%M%S")
    except Exception:
        pass
    try:
        return dateparser.parse(date_str)
    except Exception:
        return None


# ─── Suspicious Pattern Checks ─────────────────────────────────────────────

def check_date_anomalies(meta: dict) -> list:
    """
    Cross-check creation vs modification dates.
    Flags documents edited much more recently than created.
    """
    flags = []

    creation_raw = meta.get("creationDate") or meta.get("CreationDate", "")
    modified_raw = meta.get("modDate") or meta.get("ModDate", "")

    creation_dt = parse_pdf_date(creation_raw)
    modified_dt = parse_pdf_date(modified_raw)

    now = datetime.now()

    if creation_dt:
        age_days = (now - creation_dt).days
        flags.append(f"Document created: {creation_dt.strftime('%d %b %Y')}")

        if age_days < 0:
            flags.append("⚠ Creation date is in the future — metadata tampering suspected")

    if modified_dt:
        flags.append(f"Last modified: {modified_dt.strftime('%d %b %Y')}")

        # If modified very recently but document claims to be old
        modified_age_days = (now - modified_dt).days
        if modified_age_days <= 30:
            flags.append(
                f"⚠ Document was modified within the last {modified_age_days} day(s) "
                f"— recent editing of a claimed-old document is suspicious"
            )

    if creation_dt and modified_dt:
        diff_days = abs((modified_dt - creation_dt).days)
        if diff_days > 0 and modified_dt > creation_dt:
            if diff_days > 365:
                flags.append(
                    f"⚠ Document modified {diff_days} days after creation "
                    f"— significant post-creation editing detected"
                )

    return flags


def check_software_anomalies(meta: dict) -> list:
    """
    Checks if the software used to create/edit the document
    is inconsistent with an official issuing authority.
    """
    flags = []
    creator = meta.get("creator", "").lower()
    producer = meta.get("producer", "").lower()
    combined = creator + " " + producer

    # Consumer tools that should NOT be used for official bank/govt documents
    consumer_tools = [
        "microsoft word", "google docs", "libreoffice",
        "canva", "photoshop", "gimp", "inkscape",
        "wps office", "smallpdf", "ilovepdf",
        "pdf24", "adobe acrobat dc"  # DC = desktop consumer version
    ]

    official_tools = [
        "oracle", "sap", "finacle", "temenos",
        "government", "nic ", "national informatics"
    ]

    for tool in consumer_tools:
        if tool in combined:
            flags.append(
                f"⚠ Document created/edited with consumer tool: '{tool.title()}' "
                f"— official bank/government documents should not use this software"
            )
            break

    is_official = any(t in combined for t in official_tools)
    if is_official:
        flags.append("✓ Document producer matches known official/banking software")

    if not creator and not producer:
        flags.append("⚠ No software metadata found — metadata may have been deliberately stripped")

    return flags


def check_author_anomalies(meta: dict) -> list:
    """Check author field for suspicious patterns."""
    flags = []
    author = meta.get("author", "").strip()

    if not author:
        flags.append("⚠ No author field in metadata — may indicate metadata wiping")
        return flags

    flags.append(f"Document author field: '{author}'")

    # Flag if author looks like a default/generic name
    suspicious_authors = ["user", "admin", "owner", "test", "default", "unknown"]
    if author.lower() in suspicious_authors:
        flags.append(f"⚠ Author field is a generic placeholder: '{author}'")

    return flags


# ─── Main Entry Point ──────────────────────────────────────────────────────

def analyze_document_metadata(file_path: str) -> dict:
    """
    Main entry point for metadata forensics.
    Works on both PDFs and images.
    """
    ext = os.path.splitext(file_path)[1].lower()
    all_findings = []
    raw_metadata = {}

    if ext == ".pdf":
        raw_metadata = extract_pdf_metadata(file_path)
    elif ext in [".jpg", ".jpeg", ".png", ".tiff", ".bmp"]:
        raw_metadata = extract_image_metadata(file_path)
    else:
        return {
            "layer": "Metadata Forensics",
            "metadata_score": 0,
            "findings": [f"Unsupported file type for metadata analysis: {ext}"],
            "risk_flag": False
        }

    if not raw_metadata:
        all_findings.append("⚠ No metadata found in document — metadata may have been stripped")
        metadata_score = 40  # Stripped metadata is itself suspicious
    else:
        # Run all checks
        date_flags = check_date_anomalies(raw_metadata)
        software_flags = check_software_anomalies(raw_metadata)
        author_flags = check_author_anomalies(raw_metadata)

        all_findings = date_flags + software_flags + author_flags

    # Score based on number and severity of warning flags
    warning_count = sum(1 for f in all_findings if "⚠" in f)

    if warning_count >= 3:
        metadata_score = 90
    elif warning_count == 2:
        metadata_score = 65
    elif warning_count == 1:
        metadata_score = 40
    else:
        metadata_score = 5

    return {
        "layer": "Metadata Forensics",
        "metadata_score": metadata_score,
        "raw_metadata": raw_metadata,
        "warnings_found": warning_count,
        "findings": all_findings,
        "risk_flag": metadata_score > 30
    }