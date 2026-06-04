import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
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
        marginBottom: 20,
        boxShadow: '0 0 24px rgba(244, 63, 94, 0.1)'
      }}>
        <ShieldAlert size={32} />
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>404 - Area Restricted</h1>
      <p style={{ fontSize: 14, color: 'hsl(var(--text-secondary))', maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>
        The endpoint you are trying to resolve does not exist or has been moved to secure segments.
      </p>

      <button 
        onClick={() => navigate('/')}
        className="tab-button active"
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}
      >
        <ArrowLeft size={16} /> Return to Safety
      </button>
    </div>
  )
}
