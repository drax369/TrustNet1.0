import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error: resetError } = await updatePassword(password)
      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Password update failed. Verify your authentication config.')
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
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>New Password</h2>
          <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', marginTop: 4 }}>Configure a secure password for your account</p>
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
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Password Updated</h3>
            <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
              Your account recovery is complete. You can now sign in with your new password credentials.
            </p>
            <Link to="/login" className="tab-button active" style={{ textDecoration: 'none', width: '100%', padding: '12px', boxSizing: 'border-box', marginTop: 8 }}>
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="auth-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="auth-input" 
                  style={{ paddingLeft: 38, paddingRight: 38 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters" 
                  required
                  disabled={loading}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="auth-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
                <input 
                  type="password" 
                  className="auth-input" 
                  style={{ paddingLeft: 38 }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" 
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
              {loading ? 'Committing change...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>

    </div>
  )
}
