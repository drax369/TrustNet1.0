import React from 'react'
import { Terminal, Shield, ArrowRight, BookOpen, Layers } from 'lucide-react'

export default function DocsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Technical Documentation
        </h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--text-secondary))', marginTop: 10 }}>
          Integrate the TrustNet API into your institutional loan pipelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>
        
        {/* Navigation Sidebar menu */}
        <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'sticky', top: 90 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Getting Started</span>
          <a href="#quickstart" style={{ fontSize: 13, color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Quick Start Integration</a>
          <a href="#api" style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>FastAPI Endpoint payloads</a>
          <a href="#layers" style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>Forensic parameters</a>
        </div>

        {/* Content body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          
          {/* Quickstart */}
          <section id="quickstart">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <BookOpen size={18} style={{ color: '#818cf8' }} /> Quick Start
            </h2>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6, marginBottom: 16 }}>
              The TrustNet gateway exposes simple endpoints to perform analysis. To run the analysis locally, fetch the Python virtual environment and launch Uvicorn.
            </p>
            <div className="security-terminal">
              <span style={{ color: 'hsl(var(--text-muted))' }}># Clone and spin up FastAPI server</span><br />
              <span style={{ color: '#818cf8' }}>cd</span> trustnet/backend<br />
              <span style={{ color: '#818cf8' }}>venv\Scripts\activate</span><br />
              <span style={{ color: '#10b981' }}>uvicorn app.main:app --port 8000 --reload</span>
            </div>
          </section>

          {/* API payload */}
          <section id="api">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Terminal size={18} style={{ color: '#c084fc' }} /> Single Analysis API
            </h2>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6, marginBottom: 16 }}>
              Submit a PDF payload to execute ELA, Benford's Law Chi2, metadata forensics, and BERT semantic reviews.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>POST</span>
              <span style={{ fontSize: 13, color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>/analyze</span>
            </div>

            <div className="security-terminal">
              <span style={{ color: 'hsl(var(--text-muted))' }}>// Request Body (Multipart FormData)</span><br />
              file: &lt;BINARY_PDF_OR_IMAGE_PAYLOAD&gt;<br /><br />
              <span style={{ color: 'hsl(var(--text-muted))' }}>// Success JSON Response Output</span><br />
              <span style={{ color: '#f1f5f9' }}>{`{
  "file_id": "8b9e67c8-3c4a...",
  "report": {
    "combined_risk_score": 76.5,
    "risk_level": "HIGH RISK 🔴",
    "recommended_action": "HOLD — Escalate to fraud team."
  }
}`}</span>
            </div>
          </section>

          {/* Layers parameters */}
          <section id="layers">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Layers size={18} style={{ color: '#38bdf8' }} /> Forensic Weights
            </h2>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6, marginBottom: 16 }}>
              Configure the risk aggregator scoring metrics by editing the configuration settings:
            </p>
            <div className="glass-card" style={{ padding: 18, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              <div>• Benford's Law (Financial Figures): <span style={{ color: '#818cf8' }}>25%</span></div>
              <div>• Pixel Tampering (Error Level Analysis): <span style={{ color: '#818cf8' }}>20%</span></div>
              <div>• Metadata Stamps (Creation Timeline): <span style={{ color: '#818cf8' }}>20%</span></div>
              <div>• Relational Network (Cross-Document GNN): <span style={{ color: '#818cf8' }}>20%</span></div>
              <div>• Sentence Semantic (BERT Text Outliers): <span style={{ color: '#818cf8' }}>15%</span></div>
            </div>
          </section>

        </div>

      </div>

    </div>
  )
}
