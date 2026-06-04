import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { signIn, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect path: checks router state or default to dashboard
  const redirectPath = location.state?.from?.pathname || '/dashboard'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError.message)
      } else {
        navigate(redirectPath, { replace: true })
      }
    } catch (err) {
      setError('An unexpected error occurred. Please verify your local auth setup.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider) => {
    setError(null)
    setLoading(true)
    try {
      const { data, error } = await signInWithOAuth(provider)
      if (error) {
        setError(`Failed to sign in with ${provider}: ${error.message}`)
        setLoading(false)
      }
      // OAuth will redirect automatically, no need to handle navigation
    } catch (err) {
      setError(`An error occurred during ${provider} sign in`)
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
      
      {/* Visual background glow circles */}
      <div style={{
        position: 'absolute',
        width: 250,
        height: 250,
        background: 'rgba(168, 85, 247, 0.04)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        top: '20%',
        left: '25%'
      }} />

      <div className="glass-card" style={{
        maxWidth: 400,
        width: '100%',
        padding: '36px 32px',
        background: 'rgba(20, 24, 39, 0.45)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Branding header */}
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
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Welcome Back</h2>
          <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', marginTop: 4 }}>Access your TrustNet compliance dashboard</p>
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
            fontSize: 12,
            fontWeight: 500
          }}>
            <AlertCircle size={15} style={{ color: '#f43f5e', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Signin Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: 11, color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="auth-input" 
                style={{ paddingLeft: 38, paddingRight: 38 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
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

          <button 
            type="submit" 
            className="tab-button active"
            style={{ width: '100%', padding: '12px', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>

        {/* Divider separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: 10 }}>
          <hr style={{ flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
          <span style={{ fontSize: 10, color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase' }}>or continue with</span>
          <hr style={{ flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button 
            onClick={() => handleOAuth('google')}
            className="auth-button-oauth"
            disabled={loading}
          >
            <svg size={14} viewBox="0 0 24 24" width="14" height="14" style={{ fill: 'currentColor' }}>
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.418 0-6.2-2.782-6.2-6.2s2.782-6.2 6.2-6.2c1.558 0 2.978.583 4.07 1.547l3.125-3.125C19.23 2.825 15.932 1.5 12.24 1.5c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5c6.26 0 10.5-4.24 10.5-10.5 0-.583-.058-1.225-.175-1.715H12.24z"/>
            </svg>
            Google
          </button>
          <button 
            onClick={() => handleOAuth('github')}
            className="auth-button-oauth"
            disabled={loading}
          >
            <svg size={14} viewBox="0 0 24 24" width="14" height="14" style={{ fill: 'currentColor' }}>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </button>
          <button 
            onClick={() => handleOAuth('microsoft')}
            className="auth-button-oauth"
            disabled={loading}
          >
            <svg size={14} viewBox="0 0 24 24" width="14" height="14" style={{ fill: 'currentColor' }}>
              <path d="M11.5 0H0v11.5h11.5V0zM24 0H12.5v11.5H24V0zM11.5 12.5H0V24h11.5V12.5zM24 12.5H12.5V24H24V12.5z"/>
            </svg>
            Microsoft
          </button>
          <button 
            onClick={() => handleOAuth('apple')}
            className="auth-button-oauth"
            disabled={loading}
          >
            <svg size={14} viewBox="0 0 24 24" width="14" height="14" style={{ fill: 'currentColor' }}>
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'hsl(var(--text-secondary))' }}>
          New to TrustNet? <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>

    </div>
  )
}
