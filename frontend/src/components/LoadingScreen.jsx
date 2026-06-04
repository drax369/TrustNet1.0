import React from 'react'
import { Shield, Loader2 } from 'lucide-react'

export default function LoadingScreen({ message = "Loading forensic engine..." }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#07090e',
      backgroundImage: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: '#fff',
      fontFamily: "var(--font-sans)"
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        {/* Animated Glow Ring */}
        <div style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          filter: 'blur(20px)',
          opacity: 0.4,
          animation: 'pulseGlow 2s infinite ease-in-out'
        }} />
        
        {/* Spinning Ring */}
        <div style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTop: '2px solid #6366f1',
          borderRight: '2px solid #a855f7',
          animation: 'spin 1s linear infinite'
        }} />
        
        {/* Icon Container */}
        <div style={{
          position: 'relative',
          width: 64,
          height: 64,
          background: 'rgba(14, 17, 29, 0.9)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.1)'
        }}>
          <Shield size={32} style={{ color: '#818cf8' }} />
        </div>
      </div>

      {/* Message and loading text */}
      <h3 style={{
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        marginBottom: 8,
        color: '#f1f5f9'
      }}>
        Trust<span style={{ color: '#a855f7' }}>Net</span>
      </h3>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: 'hsl(var(--text-secondary))',
        fontFamily: 'var(--font-mono)'
      }}>
        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
        <span>{message}</span>
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginTop: 16
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              animation: 'pulseDot 1.5s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
