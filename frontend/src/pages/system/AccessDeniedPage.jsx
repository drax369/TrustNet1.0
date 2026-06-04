import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'

export default function AccessDeniedPage() {
  const navigate = useNavigate()
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#07090e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
      textAlign: 'center'
    }}>
      <div style={{
        width: 64, height: 64,
        background: 'rgba(244, 63, 94, 0.05)',
        border: '1px solid rgba(244, 63, 94, 0.15)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#f43f5e',
        marginBottom: 20
      }}>
        <ShieldX size={32} />
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Access Denied</h1>
      <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', maxWidth: 380, lineHeight: 1.5, marginBottom: 28 }}>
        You do not have the credentials required to access this workspace segment. Please sign in first.
      </p>

      <button 
        onClick={() => navigate('/login')}
        className="tab-button active"
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}
      >
        <ArrowLeft size={16} /> Return to Login
      </button>
    </div>
  )
}
