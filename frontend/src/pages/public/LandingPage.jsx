import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, ArrowRight, FileCheck, HelpCircle, Activity, Lock, Users, ChevronRight, Zap } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  
  // Interactive FAQ State
  const [activeFaq, setActiveFaq] = useState(null)
  
  const faqs = [
    {
      q: "What is Error Level Analysis (ELA) and how does it detect tampering?",
      a: "Error Level Analysis works by saving an image at a specific compression rate (like 90%) and analyzing the pixel-level difference. Edited portions will compress differently compared to the original photo, highlighting tampering in digital reports or bank statement layouts."
    },
    {
      q: "How does Benford's Law Chi-Square check verify financial digits?",
      a: "Benford's Law describes the natural frequency of leading digits in numerical sets. Genuine balance statements, transaction logs, and salaries conform to this logarithmic curve. Fabricated figures usually have a randomized or uniform distribution that triggers a statistically significant Chi-Square test failure."
    },
    {
      q: "Can this system scan batches of documents at the same time?",
      a: "Yes. In batch mode, TrustNet activates a relationship graph using NetworkX that maps shared identifiers (names, emails, PAN cards, bank account numbers). If multiple files represent the same person but contain mismatching employer tags or ID numbers, the system flags a cross-document contradiction."
    },
    {
      q: "Is document processing safe for sensitive bank data?",
      a: "Absolutely. TrustNet runs on a secure local workspace. The local server processes ELA, text extractions, and metadata validations entirely on-premise, ensuring your proprietary financial records are never uploaded to public clouds."
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 80, paddingBottom: 80 }}>
      
      {/* 1. Hero Section */}
      <section style={{
        padding: '80px 24px 40px',
        maxWidth: 1200,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Ambient Blur Circle */}
        <div style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 300,
          height: 300,
          background: 'rgba(99, 102, 241, 0.12)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          zIndex: -1
        }} />

        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#818cf8',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 16,
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          padding: '6px 12px',
          borderRadius: 20,
          display: 'inline-block'
        }}>
          🛡️ Institutional Grade Document Forensics
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 56px)',
          fontWeight: 800,
          lineHeight: 1.1,
          color: '#fff',
          letterSpacing: '-0.02em',
          maxWidth: 900,
          margin: '0 auto 24px',
        }}>
          AI-Powered <span className="gradient-text">Document Fraud</span> Detection &amp; Network Auditing
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2.5vw, 18px)',
          color: 'hsl(var(--text-secondary))',
          maxWidth: 680,
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Secure your financial intake pipelines. Instantly audit digital pay slips, tax filings, and statements using pixel forensics, Benford's Law, semantic BERT processing, and user request trackers.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/register')}
            className="tab-button active"
            style={{ padding: '14px 28px', fontSize: 14, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            Start Analyzing Free <ArrowRight size={16} />
          </button>
          <Link 
            to="/docs" 
            style={{
              padding: '14px 28px', 
              fontSize: 14, 
              borderRadius: 8, 
              color: '#fff', 
              textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.01)',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600
            }}
          >
            Read API Docs
          </Link>
        </div>

        {/* Dashboard Teaser Frame */}
        <div className="glass-card animate-fade-in" style={{
          marginTop: 64,
          padding: '8px',
          background: 'rgba(20, 24, 39, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Laser Scanner effect */}
          <div className="scanner-line" />
          <img 
            src="/src/assets/hero.png" 
            alt="Dashboard Showcase" 
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'block'
            }}
            onError={(e) => {
              // Fail-safe default placeholder if hero.png does not load
              e.target.style.display = 'none';
            }}
          />
          {/* Fallback mockup UI in case image is missing */}
          <div className="desktop-only" style={{
            height: 380,
            background: '#0a0d14',
            borderRadius: 12,
            padding: 30,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 15 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ fontSize: 11, color: 'hsl(var(--text-muted))', fontFamily: 'var(--font-mono)' }}>SCANNER STATE: IDLE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 28, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
                <div style={{ height: 14, width: '90%', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }} />
                <div style={{ height: 14, width: '80%', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }} />
                <div style={{ height: 80, background: 'rgba(99,102,241,0.03)', borderRadius: 8, border: '1px dashed rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: 13, fontWeight: 600 }}>
                  Drag &amp; drop compliance PDF sheets here
                </div>
              </div>
              <div className="glass-card" style={{ padding: 15, background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>DETECTION ENGINE</div>
                <div style={{ height: 10, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 4 }} />
                <div style={{ height: 10, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 4 }} />
                <div style={{ height: 10, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. core Benefits Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Secure Your Financial Operations</h2>
          <p style={{ fontSize: 15, color: 'hsl(var(--text-secondary))', marginTop: 8 }}>TrustNet provides comprehensive visual, mathematical, and telemetry safeguards.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div className="glass-card" style={{ padding: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: 20 }}>
              <FileCheck size={20} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Document Integrity check</h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Perform JPEG error level sweeps and verify metadata logs to pinpoint copy-pasted names or backdated stamps.
            </p>
          </div>
          
          <div className="glass-card" style={{ padding: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(168, 85, 247, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', marginBottom: 20 }}>
              <Activity size={20} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Benford's Law Audit</h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Run automatic digit frequency distribution calculations. Flag non-conforming financial structures instantly.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 30 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(56, 189, 248, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: 20 }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Session &amp; Bot Analytics</h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
              Defend your upload forms from script injectors with client fingerprint audits and upload frequency trackers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Forensic Steps Workflow */}
      <section style={{ background: '#090b11', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>Simple, Automated Validation</h2>
            <p style={{ fontSize: 15, color: 'hsl(var(--text-secondary))', marginTop: 8 }}>From intake to aggregated risk reports in under 5 seconds.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 30, position: 'relative' }}>
            {[
              { step: "01", t: "Upload Intake", d: "Drag & drop files or run bulk uploads via the dashboard." },
              { step: "02", t: "Parallel Sweep", d: "FastAPI runs ELA checks, Benford distribution audits, and NLP entity sweeps." },
              { step: "03", t: "Context Cross-check", d: "Our NetworkX GNN matches PAN cards, Aadhaars, and emails across files." },
              { step: "04", t: "Actionable Report", d: "Instantly copy formatted summaries or download compliance reports." }
            ].map((item, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: 'rgba(99, 102, 241, 0.1)', fontFamily: 'var(--font-mono)' }}>{item.step}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: -10, marginBottom: 8 }}>{item.t}</h4>
                <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive FAQs Accordion */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>Frequently Answered Questions</h2>
          <p style={{ fontSize: 14, color: 'hsl(var(--text-secondary))', marginTop: 6 }}>Understand the science behind TrustNet's verification systems.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  borderRadius: 12, 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  border: `1px solid ${isOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)'}`,
                  overflow: 'hidden' 
                }}
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{faq.q}</span>
                  <HelpCircle size={16} style={{ color: isOpen ? '#818cf8' : 'hsl(var(--text-muted))' }} />
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 20px 20px',
                    fontSize: 13,
                    color: 'hsl(var(--text-secondary))',
                    lineHeight: 1.6,
                    borderTop: '1px solid rgba(255,255,255,0.02)',
                    paddingTop: 12
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Trusted by Compliance Teams</h2>
          <p style={{ fontSize: 15, color: 'hsl(var(--text-secondary))', marginTop: 8 }}>See what industry leaders say about TrustNet</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {[
            {
              name: 'Sarah Chen',
              role: 'Chief Compliance Officer',
              company: 'Global Finance Corp',
              text: 'TrustNet reduced our document fraud detection time by 85%. The ELA and Benford analysis caught sophisticated tampering that manual reviews missed.',
              avatar: 'SC'
            },
            {
              name: 'Michael Rodriguez',
              role: 'VP of Risk Management',
              company: 'SecureBank International',
              text: 'The batch analysis feature is incredible. We processed 2,000 documents in a single day and identified 47 potential fraud cases.',
              avatar: 'MR'
            },
            {
              name: 'Emily Watson',
              role: 'Director of Internal Audit',
              company: 'TechVentures Inc',
              text: 'Implementation was seamless. The OAuth integration and secure local processing met all our enterprise security requirements.',
              avatar: 'EW'
            }
          ].map((testimonial, idx) => (
            <div key={idx} className="glass-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--accent-gradient)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, color: '#fff'
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{testimonial.name}</div>
                  <div style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>{testimonial.role}</div>
                  <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', marginTop: 2 }}>{testimonial.company}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'hsl(var(--text-secondary))', lineHeight: 1.6 }}>
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Social Proof / Stats Section */}
      <section style={{
        background: '#090b11',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
            {[
              { value: '2.5M+', label: 'Documents Analyzed' },
              { value: '99.7%', label: 'Detection Accuracy' },
              { value: '500+', label: 'Enterprise Clients' },
              { value: '24/7', label: 'Monitoring Active' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Big final Call to Action */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div className="glass-card" style={{
          background: 'radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.15) 0%, transparent 60%), rgba(20, 24, 39, 0.35)',
          padding: '60px 40px',
          textAlign: 'center',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Ready to secure your compliance intake?
          </h2>
          <p style={{ fontSize: 15, color: 'hsl(var(--text-secondary))', maxWidth: 580, lineHeight: 1.5 }}>
            Join risk officers at top institutions leveraging automated pixel auditing, document profile verification, and upload session tracking.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/register')}
              className="tab-button active"
              style={{ padding: '14px 32px', fontSize: 14, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Get Started Free <Zap size={16} />
            </button>
            <Link 
              to="/pricing"
              style={{
                padding: '14px 32px',
                fontSize: 14,
                borderRadius: 8,
                color: '#fff',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
              }}
            >
              View Pricing
            </Link>
          </div>
          <div style={{ fontSize: 12, color: 'hsl(var(--text-muted))', marginTop: 8 }}>
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </section>

    </div>
  )
}
