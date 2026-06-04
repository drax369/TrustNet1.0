import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Shield } from 'lucide-react'

export default function PricingPage() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'annual'

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for single officers and small accounting teams.",
      price: billingCycle === 'monthly' ? 49 : 39,
      features: [
        "100 document scans / month",
        "Error Level Analysis (ELA)",
        "Metadata Forensics scan",
        "Local session storage history",
        "Email support response in 24h"
      ],
      cta: "Start Starter Trial",
      popular: false
    },
    {
      name: "Professional",
      desc: "Ideal for growing financial firms needing complete security.",
      price: billingCycle === 'monthly' ? 149 : 119,
      features: [
        "1,000 document scans / month",
        "Full 5 Document Forensic layers",
        "Chi2 Benford & BERT NLP parser",
        "Cross-Document GNN Relationship graphs",
        "Device fingerprinting & bot telemetry",
        "Priority API integrations",
        "Priority SLA support in 2 hours"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      desc: "For institutions requiring absolute compliance at scale.",
      price: "Custom",
      features: [
        "Unlimited monthly operations",
        "On-premise offline deployment options",
        "Custom BERT model fine-tuning support",
        "Multi-region network security gateway",
        "Dedicated compliance team account",
        "Assigned account manager",
        "Custom webhook triggers"
      ],
      cta: "Contact Enterprise Sales",
      popular: false
    }
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Transparent, Scalable Pricing
        </h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--text-secondary))', marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>
          Choose the right security posture for your compliance pipelines.
        </p>

        {/* Toggle Switch */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: 4,
          borderRadius: 8,
          marginTop: 24
        }}>
          <button 
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: billingCycle === 'monthly' ? 'var(--accent-gradient)' : 'transparent',
              color: billingCycle === 'monthly' ? '#fff' : 'hsl(var(--text-secondary))',
            }}
          >
            Monthly Billing
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: billingCycle === 'annual' ? 'var(--accent-gradient)' : 'transparent',
              color: billingCycle === 'annual' ? '#fff' : 'hsl(var(--text-secondary))',
            }}
          >
            Annual Billing (20% off)
          </button>
        </div>
      </div>

      {/* Plans Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch' }}>
        {plans.map((p, idx) => (
          <div 
            key={idx} 
            className="glass-card" 
            style={{
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              background: p.popular ? 'rgba(20, 24, 39, 0.5)' : 'var(--bg-card-glass)',
              border: p.popular ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: p.popular ? '0 12px 40px rgba(99, 102, 241, 0.05)' : 'none',
              transform: p.popular ? 'scale(1.02)' : 'none',
            }}
          >
            {p.popular && (
              <span style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'var(--accent-gradient)',
                fontSize: 9,
                fontWeight: 700,
                color: '#fff',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 20
              }}>
                Recommended
              </span>
            )}

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.5, marginBottom: 24 }}>{p.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
                {typeof p.price === 'number' ? (
                  <>
                    <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>${p.price}</span>
                    <span style={{ fontSize: 13, color: 'hsl(var(--text-muted))' }}>/ month</span>
                  </>
                ) : (
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{p.price}</span>
                )}
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'hsl(var(--text-secondary))' }}>
                    <Check size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => {
                if (p.price === 'Custom') {
                  navigate('/contact')
                } else {
                  navigate('/register')
                }
              }}
              className={`tab-button ${p.popular ? 'active' : ''}`}
              style={{ width: '100%', padding: '12px' }}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
