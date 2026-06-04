import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Shield, CreditCard, Check, Download, Info } from 'lucide-react'

export default function BillingPage() {
  const { user, updateProfile, isDemoMode } = useAuth()
  
  // Read current subscription tier from user metadata or localStorage (demo mode)
  const [currentTier, setCurrentTier] = useState(() => {
    if (user?.user_metadata?.preferences?.tier) {
      return user.user_metadata.preferences.tier
    }
    const storedTier = localStorage.getItem('trustnet_tier')
    return storedTier || 'Starter'
  })
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async (tierName) => {
    setLoading(true)
    try {
      if (isDemoMode || !user) {
        // Demo mode: save to localStorage
        localStorage.setItem('trustnet_tier', tierName)
        setCurrentTier(tierName)
      } else {
        // Production mode: save to Supabase user metadata
        await updateProfile({
          preferences: {
            ...user?.user_metadata?.preferences,
            tier: tierName
          }
        })
        setCurrentTier(tierName)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Mock invoice logs
  const invoices = [
    { id: "INV-2026-001", date: "Jun 1, 2026", amount: "$49.00", status: "Paid" },
    { id: "INV-2026-002", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
    { id: "INV-2026-003", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" }
  ]

  const maxScans = currentTier === 'Starter' ? 100 : 1000
  const currentScans = 14

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
      
      {/* 1. Subscription Tier display card */}
      <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Subscription &amp; Usage</h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>Manage active SaaS tiers and quotas</p>
        </div>

        {/* Current Plan visual */}
        <div style={{
          background: 'var(--accent-gradient)',
          borderRadius: 12,
          padding: '20px 24px',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)'
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.08em' }}>ACTIVE PLAN</div>
          <h3 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 10px' }}>TrustNet {currentTier}</h3>
          <p style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.4 }}>
            {currentTier === 'Starter' 
              ? 'Basic forensic ELA scanning and local history logs enabled.' 
              : 'Full analytical suite, cross-document GNN, and telemetry modules enabled.'}
          </p>
        </div>

        {/* Quota slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'hsl(var(--text-secondary))', marginBottom: 6 }}>
            <span>Monthly scan usage</span>
            <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{currentScans} / {maxScans}</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(currentScans / maxScans) * 100}%`, background: '#818cf8', borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 10, color: 'hsl(var(--text-muted))', display: 'block', marginTop: 6 }}>Quota resets in 28 days</span>
        </div>

        {/* Tier change actions */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Change Active Tier</h4>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={() => handleUpgrade('Starter')}
              className={`tab-button ${currentTier === 'Starter' ? 'active' : ''}`}
              style={{ flex: 1, padding: '10px' }}
              disabled={loading}
            >
              Starter
            </button>
            <button 
              onClick={() => handleUpgrade('Professional')}
              className={`tab-button ${currentTier === 'Professional' ? 'active' : ''}`}
              style={{ flex: 1, padding: '10px' }}
              disabled={loading}
            >
              Professional
            </button>
          </div>
        </div>
      </div>

      {/* 2. Billing history invoices list */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Invoicing Records</h3>
          <p style={{ fontSize: 11, color: 'hsl(var(--text-muted))' }}>Review transactional statement lists</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Billing Date</th>
                <th>Charge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, color: '#fff', fontSize: 12 }}>{inv.id}</td>
                  <td>{inv.date}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{inv.amount}</td>
                  <td>
                    <button 
                      onClick={() => alert(`Downloading Invoice PDF: ${inv.id}`)}
                      style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 4 }}
                      title="Download PDF"
                    >
                      <Download size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
