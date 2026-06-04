import React from 'react'
import { Link } from 'react-router-dom'
import { Eye, Binary, ShieldAlert, Cpu, Network, FileText, Share2, HelpCircle } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)' }}>
      
      {/* Page header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Deep-Dive Analytical Features
        </h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--text-secondary))', marginTop: 10, maxWidth: 600, margin: '10px auto 0' }}>
          Explore the visual, numerical, and network telemetry guards securing your document collection portals.
        </p>
      </div>

      {/* Grid of details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {/* Document section header */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={18} style={{ color: '#6366f1' }} /> Document Forensic Suite
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Eye size={16} style={{ color: '#818cf8' }} /> Error Level Analysis (ELA)
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Exposes photo tampering by re-saving document pages and calculating the differences in pixel variance. Suspicious regions show up as high-brightness outlines.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Binary size={16} style={{ color: '#a855f7' }} /> Benford's Law Chi2 Tests
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Verifies mathematical naturalness of document numbers. Uses SciPy to perform goodness-of-fit distributions on salaries, dates, and account figures.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <ShieldAlert size={16} style={{ color: '#ec4899' }} /> Metadata Timelines
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Extracts hidden timestamps to flag if a statement was edited years after creation, generated using Canva/Photoshop, or carries generic 'Admin' authors.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Cpu size={16} style={{ color: '#38bdf8' }} /> BERT Semantic Anomaly
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Leverages SentenceTransformers to verify tense consistency and detect semantic outlier copy-pastes while extracting PAN and Aadhaar records.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24, gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Share2 size={16} style={{ color: '#10b981' }} /> Cross-Document GNN
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Builds entity networks to identify discrepancies across a batch (e.g. same user applying with mismatching employer fields or PAN identifiers).
            </p>
          </div>

        </div>

        {/* Telemetry section header */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 12, marginTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Network size={18} style={{ color: '#a855f7' }} /> Telemetry &amp; Gateway Security
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Network size={16} style={{ color: '#6366f1' }} /> Isolation Forest Anomaly model
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Machine learning forest evaluates request intervals, upload duration, payload sizes, and capture hours to flag bot telemetry profiles.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Cpu size={16} style={{ color: '#a855f7' }} /> LSTM Sequence Auditing
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Monitors high-frequency submissions from a single IP to identify script injection botnets, upload intervals, and identical file size repetitions.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Eye size={16} style={{ color: '#38bdf8' }} /> Device Fingerprinting
            </h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Exposes automation frameworks (Postman, okhttp, axios, curl, selenium) and flags mid-session browser hijacking or VPN spoofing.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}
