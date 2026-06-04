import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Mail, Lock, User, AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Password Validation Criteria Checks
  const criteria = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const isPasswordValid = criteria.length && criteria.number && criteria.special

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!isPasswordValid) {
      setError('Password does not meet the complexity criteria')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await signUp(email, password, name)
      if (signUpError) {
        setError(signUpError.message)
      } else {
        // Redirect to verification instructions page
        navigate('/verify-email', { state: { email } })
      }
    } catch (err) {
      setError('Signup failed. Verify backend configurations.')
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
        maxWidth: 440,
        width: '100%',
        padding: '36px 32px',
        background: 'rgba(20, 24, 39, 0.45)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Create Officer Account</h2>
          <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', marginTop: 4 }}>Begin your free 14-day evaluation trial</p>
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

        {/* Signup Form */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="auth-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
              <input 
                type="text" 
                className="auth-input" 
                style={{ paddingLeft: 38 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" 
                required
                disabled={loading}
              />
            </div>
          </div>

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
            <label className="auth-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--text-muted))' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="auth-input" 
                style={{ paddingLeft: 38, paddingRight: 38 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters" 
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

            {/* Password strength checklist */}
            {password && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 10, borderRadius: 6 }}>
                <span style={{ fontSize: 10, color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Password Criteria:</span>
                {[
                  { label: "At least 8 characters", valid: criteria.length },
                  { label: "At least one number", valid: criteria.number },
                  { label: "At least one special character (!@#...)", valid: criteria.special }
                ].map((crit, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: crit.valid ? '#10b981' : 'hsl(var(--text-secondary))' }}>
                    {crit.valid ? <Check size={11} /> : <X size={11} style={{ color: 'hsl(var(--text-muted))' }} />}
                    <span>{crit.label}</span>
                  </div>
                ))}
              </div>
            )}
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
                placeholder="Re-enter password" 
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="tab-button active"
            style={{ width: '100%', padding: '12px', marginTop: 10 }}
            disabled={loading || !isPasswordValid}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'hsl(var(--text-secondary))' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>

    </div>
  )
}
