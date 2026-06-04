import React from 'react'
import { Shield, Users, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Combatting Fraud with Science
        </h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--text-secondary))', marginTop: 10 }}>
          Our mission is to establish trust in financial intake platforms through mathematical validation.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {/* Story */}
        <div className="glass-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Our Origins</h2>
          <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.7, marginBottom: 14 }}>
            TrustNet was founded in 2026 by a group of computational forensics researchers and bank security engineers. They recognized that while standard OCR systems could parse documents, they failed to recognize pixel manipulations, fabricated numbers, or coordinated identity mixing across applications.
          </p>
          <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.7 }}>
            By combining classical signal analysis (Error Level Analysis), statistical audits (Benford's Law Chi-Square), neural text embeds (BERT SentenceTransformers), and relational graphs (NetworkX), we built an automated validation suite that scans payloads on-premise without public cloud exposure.
          </p>
        </div>

        {/* Values */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20, textAlign: 'center' }}>Our Core Pillars</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99,102,241,0.05)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Shield size={18} />
              </div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Privacy First</h4>
              <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>All scanners execute locally to prevent exposing applicant logs to public endpoints.</p>
            </div>
            
            <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(168,85,247,0.05)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Award size={18} />
              </div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Scientific Rigour</h4>
              <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>Every warning score corresponds directly to a verifiable mathematical index.</p>
            </div>

            <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.05)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Users size={18} />
              </div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Team Alignment</h4>
              <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>Providing plain-English insights so compliance officers can make split-second choices.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
