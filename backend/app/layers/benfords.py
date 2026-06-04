import re
import numpy as np
from scipy.stats import chisquare
import fitz  # PyMuPDF


# Benford's expected distribution for digits 1-9
BENFORDS_EXPECTED = {
    1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097,
    5: 0.079, 6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046
}


def extract_text_from_file(file_path: str) -> str:
    """Extract all text from PDF or return empty for images."""
    if file_path.lower().endswith(".pdf"):
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    else:
        # Images don't have extractable text — skip Benford's
        return ""


def extract_numbers(text: str) -> list:
    """
    Extract all numeric values from text.
    Filters out years, phone numbers, pin codes (not financial).
    Keeps values that look like amounts, salaries, balances.
    """
    # Match numbers with optional commas/decimals
    raw_numbers = re.findall(r'\b\d[\d,]*\.?\d*\b', text)

    cleaned = []
    for n in raw_numbers:
        n_clean = n.replace(",", "")
        try:
            val = float(n_clean)
            # Filter: ignore years (1900-2099), short codes, tiny numbers
            if val < 10:
                continue
            if 1900 <= val <= 2099:
                continue
            if len(str(int(val))) <= 3 and val < 1000:
                continue
            cleaned.append(val)
        except ValueError:
            continue

    return cleaned


def get_leading_digits(numbers: list) -> list:
    """Extract the first significant digit from each number."""
    leading = []
    for n in numbers:
        s = str(abs(n)).lstrip("0").replace(".", "")
        if s:
            leading.append(int(s[0]))
    return [d for d in leading if 1 <= d <= 9]


def run_benfords_test(numbers: list) -> dict:
    """
    Apply Benford's Law chi-square test to a list of numbers.
    Returns score and findings.
    """
    if len(numbers) < 20:
        return {
            "benfords_score": 0,
            "numbers_analyzed": len(numbers),
            "findings": ["Insufficient numeric data for Benford's test (need at least 20 numbers)"],
            "risk_flag": False,
            "skipped": True
        }

    leading_digits = get_leading_digits(numbers)
    total = len(leading_digits)

    # Count observed frequency of each digit
    observed_counts = {d: 0 for d in range(1, 10)}
    for d in leading_digits:
        observed_counts[d] += 1

    # Build observed vs expected arrays
    observed = []
    expected = []
    observed_pct = {}

    for d in range(1, 10):
        obs = observed_counts[d]
        exp = BENFORDS_EXPECTED[d] * total
        observed.append(obs)
        expected.append(exp)
        observed_pct[d] = round(obs / total, 3)

    # Chi-square goodness of fit test
    chi2_stat, p_value = chisquare(f_obs=observed, f_exp=expected)

    # Mean Absolute Deviation from Benford's expected
    mad = np.mean([abs(observed_pct[d] - BENFORDS_EXPECTED[d]) for d in range(1, 10)])

    # Score: higher = more suspicious
    # MAD > 0.015 = nonconforming, p_value < 0.05 = statistically significant deviation
    if p_value < 0.01 and mad > 0.02:
        benfords_score = 85
        verdict = "Strong Benford's Law violation — numeric data is likely fabricated"
    elif p_value < 0.05 and mad > 0.015:
        benfords_score = 60
        verdict = "Moderate Benford's deviation — financial figures show suspicious patterns"
    elif p_value < 0.10:
        benfords_score = 35
        verdict = "Mild deviation from Benford's Law — warrants closer review"
    else:
        benfords_score = 5
        verdict = "Benford's Law test passed — numeric distribution appears natural"

    findings = [verdict]

    # Highlight most deviated digit
    max_dev_digit = max(range(1, 10), key=lambda d: abs(observed_pct[d] - BENFORDS_EXPECTED[d]))
    dev_amount = abs(observed_pct[max_dev_digit] - BENFORDS_EXPECTED[max_dev_digit])
    if dev_amount > 0.05:
        findings.append(
            f"Digit '{max_dev_digit}' appears {observed_pct[max_dev_digit]*100:.1f}% "
            f"(expected {BENFORDS_EXPECTED[max_dev_digit]*100:.1f}%) — "
            f"deviation of {dev_amount*100:.1f}%"
        )

    return {
        "layer": "Benford's Law Statistical Testing",
        "benfords_score": benfords_score,
        "numbers_analyzed": total,
        "chi2_statistic": round(chi2_stat, 4),
        "p_value": round(p_value, 4),
        "mean_absolute_deviation": round(mad, 4),
        "observed_distribution": observed_pct,
        "expected_distribution": BENFORDS_EXPECTED,
        "findings": findings,
        "risk_flag": benfords_score > 30
    }


def analyze_document_benfords(file_path: str) -> dict:
    """Main entry point — extract numbers and run Benford's test."""
    text = extract_text_from_file(file_path)

    if not text.strip():
        return {
            "layer": "Benford's Law Statistical Testing",
            "benfords_score": 0,
            "findings": ["No extractable text found — skipping Benford's test (image-only document)"],
            "risk_flag": False,
            "skipped": True
        }

    numbers = extract_numbers(text)
    return run_benfords_test(numbers)