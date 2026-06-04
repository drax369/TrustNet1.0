import os
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import fitz  # PyMuPDF — for converting PDF pages to images
import tempfile


def pdf_to_images(pdf_path: str) -> list:
    """Convert each page of a PDF to a PIL Image."""
    doc = fitz.open(pdf_path)
    images = []
    for page in doc:
        pix = page.get_pixmap(dpi=150)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(img)
    doc.close()
    return images


def run_ela(image: Image.Image, quality: int = 90) -> dict:
    """
    Run Error Level Analysis on a single PIL image.
    Returns a dict with ELA score and findings.
    """
    # Save image at reduced quality to temp file
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = tmp.name

    image.convert("RGB").save(tmp_path, "JPEG", quality=quality)

    # Reload the re-compressed image
    recompressed = Image.open(tmp_path).convert("RGB")
    os.unlink(tmp_path)

    # Compute pixel-by-pixel difference
    diff = ImageChops.difference(image.convert("RGB"), recompressed)

    # Enhance the difference for analysis
    enhancer = ImageEnhance.Brightness(diff)
    enhanced_diff = enhancer.enhance(10)

    # Convert to numpy for stats
    diff_array = np.array(enhanced_diff).astype(np.float32)

    # Calculate ELA metrics
    mean_ela = float(np.mean(diff_array))
    max_ela = float(np.max(diff_array))
    std_ela = float(np.std(diff_array))

    # Detect suspicious high-ELA regions
    threshold = mean_ela + (2.5 * std_ela)
    suspicious_pixels = int(np.sum(diff_array > threshold))
    total_pixels = diff_array.size
    suspicious_ratio = suspicious_pixels / total_pixels

    # Score: 0 = clean, 100 = highly suspicious
    ela_score = min(100, round(suspicious_ratio * 1000, 2))

    findings = []
    if ela_score > 60:
        findings.append("High ELA variance — strong evidence of image manipulation")
    elif ela_score > 30:
        findings.append("Moderate ELA anomaly — possible editing detected in document")
    elif ela_score > 10:
        findings.append("Low-level ELA signal — minor inconsistency, likely benign")
    else:
        findings.append("ELA clean — no pixel-level tampering detected")

    return {
        "ela_score": ela_score,
        "mean_ela": round(mean_ela, 3),
        "max_ela": round(max_ela, 3),
        "std_ela": round(std_ela, 3),
        "suspicious_pixel_ratio": round(suspicious_ratio, 5),
        "findings": findings
    }


def analyze_document_ela(file_path: str) -> dict:
    """
    Main entry point. Accepts a PDF or image file path.
    Returns aggregated ELA results across all pages.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        images = pdf_to_images(file_path)
    elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
        images = [Image.open(file_path)]
    else:
        return {"error": f"Unsupported file type: {ext}"}

    page_results = []
    for i, img in enumerate(images):
        result = run_ela(img)
        result["page"] = i + 1
        page_results.append(result)

    # Aggregate: take the worst (highest) ELA score across all pages
    max_score = max(r["ela_score"] for r in page_results)
    all_findings = []
    for r in page_results:
        for f in r["findings"]:
            all_findings.append(f"Page {r['page']}: {f}")

    return {
        "layer": "ELA — Error Level Analysis",
        "overall_ela_score": max_score,
        "pages_analyzed": len(page_results),
        "page_results": page_results,
        "findings": all_findings,
        "risk_flag": max_score > 30
    }