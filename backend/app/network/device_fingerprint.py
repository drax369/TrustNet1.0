import hashlib
import re
from user_agents import parse as parse_ua


# ─── Known suspicious IP ranges / patterns ────────────────────────────────
# In production: integrate with a real IP reputation API (e.g. AbuseIPDB)

SUSPICIOUS_IP_PATTERNS = [
    r'^10\.',           # Private range — unexpected for public portal
    r'^127\.',          # Localhost
    r'^0\.',            # Invalid
]

KNOWN_VPN_INDICATORS = [
    "vpn", "proxy", "tor", "anonymous",
    "datacenter", "hosting", "server"
]

# Legitimate browser user agent keywords
LEGIT_BROWSERS = ["chrome", "firefox", "safari", "edge", "opera"]


def generate_session_fingerprint(user_agent: str, ip: str) -> str:
    """Generate a unique fingerprint for a session."""
    raw = f"{user_agent}|{ip}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def analyze_user_agent(user_agent: str) -> dict:
    """Parse and analyse the user agent string."""
    findings = []
    ua_score = 0

    if not user_agent or user_agent.strip() == "":
        return {
            "ua_score": 40,
            "findings": ["⚠ No User-Agent header — automated tool suspected"],
            "is_bot": True,
            "browser": "unknown"
        }

    ua = parse_ua(user_agent)

    # Check if it's a known bot/script
    if ua.is_bot:
        findings.append(
            f"⚠ Request identified as bot/crawler: {ua.browser.family}"
        )
        ua_score += 50

    # Check for automation tools
    automation_tools = [
        "python-requests", "curl", "wget", "httpie",
        "postman", "insomnia", "axios", "okhttp"
    ]
    ua_lower = user_agent.lower()
    for tool in automation_tools:
        if tool in ua_lower:
            findings.append(
                f"⚠ Automated tool detected in User-Agent: '{tool}'"
            )
            ua_score += 45
            break

    # Check for legitimate browser
    if not ua.is_bot and ua_score == 0:
        browser = ua.browser.family.lower()
        if any(b in browser for b in LEGIT_BROWSERS):
            findings.append(
                f"✓ Legitimate browser: {ua.browser.family} "
                f"{ua.browser.version_string} on {ua.os.family}"
            )
        else:
            findings.append(
                f"⚠ Unrecognised browser/client: {ua.browser.family}"
            )
            ua_score += 20

    return {
        "ua_score":  ua_score,
        "findings":  findings,
        "is_bot":    ua.is_bot,
        "browser":   ua.browser.family,
        "os":        ua.os.family,
        "is_mobile": ua.is_mobile
    }


def analyze_ip(ip: str) -> dict:
    """Basic IP analysis and suspicion scoring."""
    findings = []
    ip_score = 0

    if not ip:
        return {
            "ip_score": 30,
            "findings": ["⚠ No IP address provided"],
            "risk_flag": True
        }

    # Check suspicious IP patterns
    for pattern in SUSPICIOUS_IP_PATTERNS:
        if re.match(pattern, ip):
            findings.append(
                f"⚠ IP address {ip} matches suspicious range pattern"
            )
            ip_score += 30
            break

    if ip_score == 0:
        findings.append(f"✓ IP address {ip} — no known suspicious patterns")

    return {
        "ip_score":  ip_score,
        "ip":        ip,
        "findings":  findings,
        "risk_flag": ip_score >= 30
    }


def analyze_device_fingerprint(
    user_agent: str,
    ip: str,
    prev_fingerprint: str = None
) -> dict:
    """
    Main device fingerprinting entry point.
    Detects session changes and suspicious clients.
    """
    ua_result  = analyze_user_agent(user_agent)
    ip_result  = analyze_ip(ip)

    fingerprint = generate_session_fingerprint(user_agent, ip)
    all_findings = ua_result["findings"] + ip_result["findings"]
    total_score  = ua_result["ua_score"] + ip_result["ip_score"]

    # Check for mid-session fingerprint change
    if prev_fingerprint and prev_fingerprint != fingerprint:
        all_findings.append(
            "⚠ Device fingerprint changed mid-session "
            "— possible session hijacking or proxy switching"
        )
        total_score += 40

    return {
        "fingerprint":   fingerprint,
        "ua_analysis":   ua_result,
        "ip_analysis":   ip_result,
        "device_score":  min(total_score, 100),
        "findings":      all_findings,
        "risk_flag":     total_score >= 30
    }