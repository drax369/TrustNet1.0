import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Shield, User, Mail, ShieldAlert, CheckCircle, Smartphone, Lock } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  
  // Edit state
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [role, setRole] = useState(user?.user_metadata?.role || 'Senior Compliance Officer')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError(null)

    try {
      const { error: updateError } = await updateProfile({
        full_name: name,
        role: role
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch (err) {
      setError('Unexpected error updating profile data.')
    } finally {
      setSaving(false)
    }
  }

  // Security logs mock list
  const securityLogs = [
    { id: 1, action: "Authentication completed", ip: "192.168.1.100", date: "Just now", status: "success" },
    { id: 2, action: "Profile parameters modified", ip: "192.168.1.100", date: "10 mins ago", status: "success" },
    { id: 3, action: "Session authorized via local credentials", ip: "192.168.1.100", date: "1 hour ago", status: "success" },
    { id: 4, action: "Password update sequence initiated", ip: "192.168.1.102", date: "Yesterday", status: "failed" }
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
      
      {/* 1. Account Details Modification Form */}
      <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Account Profile</h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>Configure your basic account identifiers</p>
        </div>

        {/* Success / Error Banners */}
        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: 8, color: '#a7f3d0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={14} style={{ color: '#10b981' }} />
            <span>Profile settings persisted!</span>
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '10px', borderRadius: 8, color: '#fda4af', fontSize: 12 }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar Brief */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 16 }}>
            <img 
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
              alt="Profile" 
              style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Profile Avatar</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))' }}>Image generated via account initials</div>
            </div>
          </div>

          <div>
            <label className="auth-label">Registered Email</label>
            <input 
              type="text" 
              className="auth-input" 
              value={user?.email || ''} 
              disabled 
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label className="auth-label">Display Name</label>
            <input 
              type="text" 
              className="auth-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name" 
              required
              disabled={saving}
            />
          </div>

          <div>
            <label className="auth-label">Officer Title / Role</label>
            <input 
              type="text" 
              className="auth-input" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Audit Lead" 
              required
              disabled={saving}
            />
          </div>

          <button 
            type="submit" 
            className="tab-button active"
            style={{ width: '100%', padding: '12px' }}
            disabled={saving}
          >
            {saving ? 'Saving changes...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* 2. Security Log Details Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Connected accounts */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Authorized Providers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <span style={{ color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} /> Email / Password Credentials</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <span style={{ color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: 8 }}><Lock size={14} /> Google Account integration</span>
              <span style={{ color: 'hsl(var(--text-muted))' }}>UNCONNECTED</span>
            </div>
          </div>
        </div>

        {/* Security Logs */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Security Audit Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {securityLogs.map(log => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: 12, 
                  borderBottom: '1px solid rgba(255,255,255,0.03)', 
                  paddingBottom: 8 
                }}
              >
                <div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{log.action}</div>
                  <span style={{ color: 'hsl(var(--text-muted))', fontSize: 10 }}>IP: {log.ip}</span>
                </div>
                <span style={{ color: log.status === 'success' ? '#10b981' : '#f43f5e', fontSize: 11, fontWeight: 600 }}>{log.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
