export const MOCK_CLEAN_REPORT = {
  isDemo: true,
  file_id: "demo-clean-slip",
  filename: "Salary_Slip_May2026.pdf",
  report: {
    filename: "Salary_Slip_May2026.pdf",
    combined_risk_score: 8.5,
    risk_level: "CLEAN 🟢",
    risk_colour: "green",
    recommended_action: "PROCEED — No significant anomalies detected.",
    urgency: "No action required",
    flags_summary: {
      total_flags: 0,
      high_severity: 0,
      medium_severity: 0
    },
    layer_scores: {
      ela: 5,
      benfords: 8,
      metadata: 5,
      nlp: 5,
      gnn: 0
    },
    layer_health: [
      { layer: "Pixel Forensics (ELA)", layer_key: "ela", score: 5, risk_flag: false, skipped: false, status: "clean" },
      { layer: "Financial Figure Analysis", layer_key: "benfords", score: 8, risk_flag: false, skipped: false, status: "clean" },
      { layer: "Document Metadata", layer_key: "metadata", score: 5, risk_flag: false, skipped: false, status: "clean" },
      { layer: "Semantic Text Analysis", layer_key: "nlp", score: 5, risk_flag: false, skipped: false, status: "clean" },
      { layer: "Cross-Document Comparison", layer_key: "gnn", score: 0, risk_flag: false, skipped: true, status: "skipped" }
    ],
    prioritised_flags: [],
    plain_english_report: `TRUSTNET ANALYSIS REPORT — Salary_Slip_May2026.pdf
Generated: 03 Jun 2026, 18:00
──────────────────────────────────────────────────

VERDICT: CLEAN 🟢
Risk Score: 8.5/100
Recommended Action: PROCEED — No significant anomalies detected.

No significant red flags detected.

LAYER BREAKDOWN:
  • Pixel Forensics (ELA): Clean (5/100) 🟢
  • Financial Figure Analysis: Clean (8/100) 🟢
  • Document Metadata: Clean (5/100) 🟢
  • Semantic Text Analysis: Clean (5/100) 🟢
  • Cross-Document Comparison: — (skipped — insufficient data)

──────────────────────────────────────────────────
This report was generated automatically by TrustNet AI.
All flagged items should be verified by a qualified officer before any action is taken.`,
    generated_at: new Date().toISOString()
  },
  layers: {
    ela: {
      layer: "ELA — Error Level Analysis",
      overall_ela_score: 5.0,
      pages_analyzed: 1,
      page_results: [
        { page: 1, ela_score: 5.0, mean_ela: 2.1, max_ela: 12.0, std_ela: 1.5, suspicious_pixel_ratio: 0.001, findings: ["ELA clean — no pixel-level tampering detected"] }
      ],
      findings: ["Page 1: ELA clean — no pixel-level tampering detected"],
      risk_flag: false
    },
    benfords: {
      layer: "Benford's Law Statistical Testing",
      benfords_score: 8.0,
      numbers_analyzed: 34,
      chi2_statistic: 4.23,
      p_value: 0.835,
      mean_absolute_deviation: 0.008,
      observed_distribution: {
        1: 0.312, 2: 0.182, 3: 0.118, 4: 0.094, 5: 0.088, 6: 0.059, 7: 0.059, 8: 0.059, 9: 0.029
      },
      expected_distribution: {
        1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097, 5: 0.079, 6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046
      },
      findings: ["Benford's Law test passed — numeric distribution appears natural"],
      risk_flag: false
    },
    metadata: {
      layer: "Metadata Forensics",
      metadata_score: 5,
      raw_metadata: {
        creationDate: "D:20260515124000+05'30'",
        modDate: "D:20260515124210+05'30'",
        producer: "SAP NetWeaver PDF Generator",
        creator: "SAP Financials ERP",
        author: "Accounts Payroll Department",
        title: "Salary Statement May 2026"
      },
      warnings_found: 0,
      findings: [
        "Document created: 15 May 2026",
        "Last modified: 15 May 2026",
        "✓ Document producer matches known official/banking software: SAP Financials ERP",
        "Document author field: 'Accounts Payroll Department'"
      ],
      risk_flag: false
    },
    nlp: {
      layer: "BERT NLP Semantic Analysis",
      nlp_score: 5,
      document_type: "salary_slip",
      entities_found: {
        pan_numbers: ["ABCDE1234F"],
        aadhaar_numbers: ["4321 8765 0987"],
        emails: ["payroll@corporate.com"],
        monetary_amounts: ["₹75,000.00", "₹12,400.00"]
      },
      sentences_analyzed: 14,
      warnings_found: 0,
      findings: [
        "Document classified as: Salary Slip",
        "Found pan numbers: ABCDE1234F",
        "Found aadhaar numbers: 4321 8765 0987",
        "Found emails: payroll@corporate.com",
        "✓ No tense or semantic inconsistencies detected."
      ],
      risk_flag: false
    },
    gnn: {
      skipped: true,
      findings: ["Only one document submitted — GNN requires at least 2 documents to compare"]
    }
  }
}

export const MOCK_FRAUD_REPORT = {
  isDemo: true,
  file_id: "demo-fraud-slip",
  filename: "Bank_Statement_Q1.pdf",
  report: {
    filename: "Bank_Statement_Q1.pdf",
    combined_risk_score: 76.5,
    risk_level: "HIGH RISK 🔴",
    risk_colour: "red",
    recommended_action: "HOLD — Do not process. Escalate immediately to fraud team.",
    urgency: "Immediate action required",
    flags_summary: {
      total_flags: 5,
      high_severity: 3,
      medium_severity: 2
    },
    layer_scores: {
      ela: 65,
      benfords: 85,
      metadata: 90,
      nlp: 50,
      gnn: 0
    },
    layer_health: [
      { layer: "Pixel Forensics (ELA)", layer_key: "ela", score: 65, risk_flag: true, skipped: false, status: "high" },
      { layer: "Financial Figure Analysis", layer_key: "benfords", score: 85, risk_flag: true, skipped: false, status: "high" },
      { layer: "Document Metadata", layer_key: "metadata", score: 90, risk_flag: true, skipped: false, status: "high" },
      { layer: "Semantic Text Analysis", layer_key: "nlp", score: 50, risk_flag: true, skipped: false, status: "medium" },
      { layer: "Cross-Document Comparison", layer_key: "gnn", score: 0, risk_flag: false, skipped: true, status: "skipped" }
    ],
    prioritised_flags: [
      { layer: "Document Metadata", layer_key: "metadata", score: 90, flag: "Document created/edited with consumer tool: 'Canva' — official bank/government documents should not use this software", severity: "high" },
      { layer: "Financial Figure Analysis", layer_key: "benfords", score: 85, flag: "Strong Benford's Law violation — numeric data is likely fabricated", severity: "high" },
      { layer: "Pixel Forensics (ELA)", layer_key: "ela", score: 65, flag: "Page 1: Moderate ELA anomaly — possible editing detected in document", severity: "high" },
      { layer: "Semantic Text Analysis", layer_key: "nlp", score: 50, flag: "Tense conflict: 'Future plans will execute balance payout of ₹5,00,000 on June 2026' mixed into bank transaction record", severity: "medium" },
      { layer: "Document Metadata", layer_key: "metadata", score: 90, flag: "Author field is a generic placeholder: 'Admin'", severity: "medium" }
    ],
    plain_english_report: `TRUSTNET ANALYSIS REPORT — Bank_Statement_Q1.pdf
Generated: 03 Jun 2026, 18:02
──────────────────────────────────────────────────

VERDICT: HIGH RISK 🔴
Risk Score: 76.5/100
Recommended Action: HOLD — Do not process. Escalate immediately to fraud team.

KEY RED FLAGS (5 found):
  1. [Document Metadata] Document created/edited with consumer tool: 'Canva' — official bank documents should not use this software
  2. [Financial Figure Analysis] Strong Benford's Law violation — numeric data is likely fabricated
  3. [Pixel Forensics (ELA)] Page 1: Moderate ELA anomaly — possible editing detected in document
  4. [Semantic Text Analysis] Tense conflict: 'Future plans will execute balance payout...'
  5. [Document Metadata] Author field is a generic placeholder: 'Admin'

LAYER BREAKDOWN:
  • Pixel Forensics (ELA): HIGH (65/100) 🔴
    The document image shows signs of pixel-level manipulation.
    When a document is edited digitally, the altered regions compress
    differently from the original — ELA detected these differences.
  • Financial Figure Analysis: HIGH (85/100) 🔴
    The financial figures in this document do not follow the natural
    distribution of real-world numbers (Benford's Law). Genuine
    financial data follows a predictable pattern. These numbers deviate
    significantly, suggesting they may have been fabricated.
  • Document Metadata: HIGH (90/100) 🔴
    The hidden metadata inside this document contradicts what the
    document claims. Every digital file carries timestamps and
    software information that reveals when and how it was created
    or modified.
  • Semantic Text Analysis: SUSPICIOUS (50/100) 🟡
    The text content of the document contains semantic inconsistencies
    — language patterns, tense usage, or entity references that are
    unusual or contradictory for the claimed document type.
  • Cross-Document Comparison: — (skipped — insufficient data)

──────────────────────────────────────────────────
This report was generated automatically by TrustNet AI.
All flagged items should be verified by a qualified officer before any action is taken.`,
    generated_at: new Date().toISOString()
  },
  layers: {
    ela: {
      layer: "ELA — Error Level Analysis",
      overall_ela_score: 65.0,
      pages_analyzed: 1,
      page_results: [
        { page: 1, ela_score: 65.0, mean_ela: 18.5, max_ela: 184.0, std_ela: 24.2, suspicious_pixel_ratio: 0.0452, findings: ["Moderate ELA anomaly — possible editing detected in document"] }
      ],
      findings: ["Page 1: Moderate ELA anomaly — possible editing detected in document"],
      risk_flag: true
    },
    benfords: {
      layer: "Benford's Law Statistical Testing",
      benfords_score: 85.0,
      numbers_analyzed: 58,
      chi2_statistic: 28.45,
      p_value: 0.0004,
      mean_absolute_deviation: 0.062,
      observed_distribution: {
        1: 0.086, 2: 0.103, 3: 0.121, 4: 0.138, 5: 0.172, 6: 0.155, 7: 0.052, 8: 0.086, 9: 0.086
      },
      expected_distribution: {
        1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097, 5: 0.079, 6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046
      },
      findings: [
        "Strong Benford's Law violation — numeric data is likely fabricated",
        "Digit '5' appears 17.2% (expected 7.9%) — deviation of 9.3%"
      ],
      risk_flag: true
    },
    metadata: {
      layer: "Metadata Forensics",
      metadata_score: 90,
      raw_metadata: {
        creationDate: "D:20250110093000Z",
        modDate: "D:20260603120000Z",
        producer: "Canva PDF Exporter",
        creator: "Canva UI Web Client",
        author: "Admin",
        title: "Q1 Statement Detailed"
      },
      warnings_found: 3,
      findings: [
        "Document created: 10 Jan 2025",
        "Last modified: 03 Jun 2026",
        "⚠ Document was modified within the last 0 day(s) — recent editing of a claimed-old document is suspicious",
        "⚠ Document modified 510 days after creation — significant post-creation editing detected",
        "⚠ Document created/edited with consumer tool: 'Canva' — official bank documents should not use this software",
        "⚠ Author field is a generic placeholder: 'Admin'"
      ],
      risk_flag: true
    },
    nlp: {
      layer: "BERT NLP Semantic Analysis",
      nlp_score: 50,
      document_type: "bank_statement",
      entities_found: {
        pan_numbers: ["ABCDE1234F", "XYZWP5678R"],
        emails: ["user@gmail.com"],
        monetary_amounts: ["₹5,00,000.00", "₹12,500.00", "₹1,500.00"]
      },
      sentences_analyzed: 28,
      warnings_found: 2,
      findings: [
        "Document classified as: Bank Statement",
        "Found pan numbers: ABCDE1234F, XYZWP5678R",
        "Found emails: user@gmail.com",
        "⚠ Multiple PAN numbers found (2) — unusual for a single-person document",
        "⚠ Tense conflict: 'Future plans will execute balance payout of ₹5,00,000 on June 2026' mixed into bank transaction record",
        "⚠ Semantically inconsistent sentence detected (similarity: 0.08): 'Make sure to check the recipes for standard household expenses.'"
      ],
      risk_flag: true
    },
    gnn: {
      skipped: true,
      findings: ["Only one document submitted — GNN requires at least 2 documents to compare"]
    }
  }
}

export const MOCK_NET_REPORT = {
  network_analysis: {
    layer: "Network Behaviour Monitoring",
    network_score: 42.5,
    risk_level: "SUSPICIOUS 🟡",
    action: "MONITOR — Allow with enhanced logging and manual review",
    component_scores: {
      isolation_forest: 48.2,
      lstm_sequence: 35.0,
      device_fingerprint: 45.0
    },
    flags: [
      "⚠ Isolation Forest: Anomalous traffic pattern detected",
      "⚠ Automated tool detected in User-Agent: 'Postman'"
    ],
    risk_flag: true,
    analyzed_at: new Date().toISOString()
  },
  request_info: {
    ip: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PostmanRuntime/7.39.0",
    hour: new Date().getHours()
  },
  file_size_mb: 2.45,
  components: {
    device_fingerprint: {
      fingerprint: "a9bf28d8442ce78c"
    }
  }
}
