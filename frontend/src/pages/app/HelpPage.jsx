import React, { useState } from 'react'
import { HelpCircle, Search, Mail, Send, CheckCircle2 } from 'lucide-react'

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [ticket, setTicket] = useState({ subject: '', priority: 'low', message: '' })
  const [success, setSuccess] = useState(false)

  const faqs = [
    { q: "How do I upgrade to the Professional tier?", a: "Navigate to the Billing & Plan page and select Professional from the Tier buttons. Your account will automatically upgrade immediately." },
    { q: "Are uploaded documents stored permanently?", a: "No. Documents are processed locally on the FastAPI server and saved inside the local uploads directory. You can clean these files manually or configure an automatic purge cycle." },
    { q: "What should I do if a file fails to parse?", a: "Check if the file is encrypted or password-protected. Password-locked files cannot be read by the text extraction layer. Unlock the file and try again." },
    { q: "How do I verify the FastAPI engine connection?", a: "Make sure you ran the backend server on port 8000 using Uvicorn. The Dashboard banner will render 'Local Engine Active' when it receives a successful ping from the `/health` endpoint." }
  ]

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    if (!ticket.subject || !ticket.message) return
    setSuccess(true)
    setTicket({ subject: '', priority: 'low', message: '' })
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
      
      {/* 1. FAQ search and filter list */}
      <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Help &amp; FAQs</h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>Find quick solutions to operational questions</p>
        </div>

        {/* Search Input bar */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
          <input 
            type="text" 
            className="auth-input" 
            style={{ paddingLeft: 38 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs..."
          />
        </div>

        {/* Render FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ fontSize: 12, color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '16px 0' }}>
              No matches found for "{search}"
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 10 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HelpCircle size={13} style={{ color: '#818cf8', flexShrink: 0 }} />
                  {faq.q}
                </h4>
                <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))', lineHeight: 1.5, marginTop: 4, paddingLeft: 19 }}>
                  {faq.a}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Ticketing Intake Panel Form */}
      <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Submit Support Request</h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>Open a priority compliance inquiry ticket</p>
        </div>

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: 8, color: '#a7f3d0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={14} style={{ color: '#10b981' }} />
            <span>Support ticket created successfully!</span>
          </div>
        )}

        <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="auth-label">Issue Subject</label>
            <input 
              type="text" 
              className="auth-input" 
              value={ticket.subject}
              onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
              placeholder="e.g. FastAPI connection fail" 
              required
            />
          </div>

          <div>
            <label className="auth-label">Priority Level</label>
            <select 
              value={ticket.priority}
              onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
              className="auth-input"
            >
              <option value="low">Low - General Question</option>
              <option value="medium">Medium - Operational Bug</option>
              <option value="high">High - Production Blocked</option>
            </select>
          </div>

          <div>
            <label className="auth-label">Inquiry Message</label>
            <textarea 
              className="auth-input" 
              rows={4}
              value={ticket.message}
              onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
              placeholder="Provide logs or context..." 
              style={{ resize: 'none' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="tab-button active"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px' }}
          >
            Dispatch Ticket <Send size={14} />
          </button>
        </form>
      </div>

    </div>
  )
}
