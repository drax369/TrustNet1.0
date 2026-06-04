import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await resetPassword(email)
      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please verify your email database connection.')
    } finally {
      setLoading(false)
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
        maxWidth: 400,
        width: '100%',
        padding: '36px 32px',
        background: 'rgba(20, 24, 39, 0.45)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40,
            background: 'var(--accent-gradient)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.25)'
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Reset Password</h2>
          <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', marginTop: 4 }}>We will email you account recovery links</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#fda4af',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12
          }}>
            <AlertCircle size={15} style={{ color: '#f43f5e', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <CheckCircle2 size={40} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Recovery Link Dispatched</h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
              Check your inbox at <strong>{email}</strong> for instructions to configure a new password.
            </p>
            <Link to="/login" className="tab-button" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="auth-label">Business Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                <input 
                  type="email" 
                  className="auth-input" 
                  style={{ paddingLeft: 38 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com" 
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="tab-button active"
              style={{ width: '100%', padding: '12px', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Transmitting link...' : 'Send Recovery Link'}
            </button>

            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, color: 'hsl(var(--text-secondary))', textDecoration: 'none', marginTop: 12 }}>
              <ArrowLeft size={12} /> Back to Sign In
            </Link>
          </form>
        )}
      </div>

    </div>
  )
}
