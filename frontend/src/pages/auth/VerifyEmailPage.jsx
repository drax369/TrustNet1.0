import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Mail, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [verified, setVerified] = useState(false)

  const email = location.state?.email || user?.email || 'your-email@organization.com'
  const isVerified = location.state?.verified || user?.email_confirmed_at || verified

  useEffect(() => {
    // If user is already verified and authenticated, redirect to dashboard
    if (isVerified && user) {
      setVerified(true)
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 2000)
    }
  }, [isVerified, user, navigate])

  const handleResend = async () => {
    setResending(true)
    try {
      // In a real implementation, you would call Supabase to resend verification email
      // For now, we'll simulate the success
      await new Promise(resolve => setTimeout(resolve, 800))
      setResent(true)
    } catch (err) {
      console.error('Failed to resend verification email:', err)
    } finally {
      setResending(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative'
    }}>
      
      <div className="glass-card" style={{
        maxWidth: 420,
        width: '100%',
        padding: '36px 32px',
        background: 'rgba(20, 24, 39, 0.45)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
        textAlign: 'center'
      }}>
        {/* Header */}
        {isVerified ? (
          <>
            <div style={{
              width: 44, height: 44,
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#10b981'
            }}>
              <CheckCircle2 size={22} />
            </div>
            
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: 8 }}>Email Verified!</h2>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6, marginBottom: 20 }}>
              Your email has been successfully verified. Redirecting to dashboard...
            </p>
          </>
        ) : (
          <>
            <div style={{
              width: 44, height: 44,
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#818cf8'
            }}>
              <Mail size={22} />
            </div>
            
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', marginBottom: 8 }}>Verify Your Email</h2>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.6, marginBottom: 20 }}>
              We sent a verification link to <strong style={{ color: '#fff' }}>{email}</strong>. Please check your inbox to complete activation.
            </p>

            {resent && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#a7f3d0',
                marginBottom: 20,
                fontSize: 12,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Verification email re-sent</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                onClick={handleResend}
                className="tab-button"
                style={{ width: '100%', padding: '10px' }}
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </>
        )}

        <div style={{ marginTop: 24, fontSize: 12 }}>
          <Link to="/login" style={{ color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>Back to Sign In</Link>
        </div>
      </div>

    </div>
  )
}
