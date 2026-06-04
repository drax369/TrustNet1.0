import React from 'react'
import { AlertCircle } from 'lucide-react'

export default function ErrorPage() {
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
        <AlertCircle size={32} />
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Application Error</h1>
      <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', maxWidth: 400, lineHeight: 1.5, marginBottom: 20 }}>
        An unexpected execution exception occurred in the web workspace.
      </p>

      <button 
        onClick={() => window.location.href = '/dashboard'}
        className="tab-button active"
        style={{ padding: '10px 20px' }}
      >
        Reload Dashboard
      </button>
    </div>
  )
}
