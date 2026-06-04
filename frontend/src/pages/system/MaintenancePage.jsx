import React from 'react'
import { Hammer, Shield } from 'lucide-react'

export default function MaintenancePage() {
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
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#818cf8',
        marginBottom: 20
      }}>
        <Hammer size={30} />
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>System Calibration</h1>
      <p style={{ fontSize: 14, color: 'hsl(var(--text-secondary))', maxWidth: 420, lineHeight: 1.6 }}>
        TrustNet gateways are temporarily offline for scheduled model calibrations. We will resume compliance scanning shortly.
      </p>
    </div>
  )
}
