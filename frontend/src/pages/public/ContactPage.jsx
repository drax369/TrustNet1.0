import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 80px', fontFamily: 'var(--font-sans)' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Connect with TrustNet
        </h1>
        <p style={{ fontSize: 16, color: 'hsl(var(--text-secondary))', marginTop: 10 }}>
          Reach out to our compliance teams or request an institutional demo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
        
        {/* Support channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Inquiry Channels</h2>
          
          <div className="glass-card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99,102,241,0.05)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={16} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', fontWeight: 600 }}>EMAIL SUPPORT</div>
              <a href="mailto:support@trustnet.ai" style={{ fontSize: 13, color: '#fff', fontWeight: 600, textDecoration: 'none' }}>support@trustnet.ai</a>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.05)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={16} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', fontWeight: 600 }}>SALES PHONE</div>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>+1 (800) 555-TNET</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168,85,247,0.05)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={16} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', fontWeight: 600 }}>SAN FRANCISCO HQ</div>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>100 Pine Street, SF, CA 94111</span>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="glass-card" style={{ padding: 32 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <CheckCircle size={44} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Message Dispatched</h3>
              <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
                Thank you for your message. A TrustNet compliance officer will respond within 4 hours.
              </p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="tab-button"
                style={{ marginTop: 8 }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="auth-label">Full Name</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Officer name" 
                  required
                />
              </div>
              <div>
                <label className="auth-label">Business Email</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@organization.com" 
                  required
                />
              </div>
              <div>
                <label className="auth-label">Message Payload</label>
                <textarea 
                  className="auth-input" 
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your request..." 
                  style={{ resize: 'none' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="tab-button active"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px' }}
              >
                Dispatch Message <Send size={14} />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  )
}
