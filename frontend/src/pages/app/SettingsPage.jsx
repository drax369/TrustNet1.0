import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Shield, Eye, Key, Copy, CheckCircle, RefreshCw } from 'lucide-react'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  
  // Settings States (read from user metadata or default values)
  const [autoScan, setAutoScan] = useState(user?.user_metadata?.preferences?.autoScan ?? true)
  const [emailAlerts, setEmailAlerts] = useState(user?.user_metadata?.preferences?.emailAlerts ?? false)
  const [theme, setTheme] = useState(user?.user_metadata?.preferences?.theme ?? 'dark')

  // Developer API Key states
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [success, setSuccess] = useState(false)

  // Load key if already generated
  useEffect(() => {
    const existingKey = localStorage.getItem('trustnet_dev_apikey')
    if (existingKey) {
      setApiKey(existingKey)
    }
  }, [])

  const handleSavePreferences = async () => {
    setSuccess(false)
    try {
      await updateProfile({
        preferences: {
          autoScan,
          emailAlerts,
          theme
        }
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerateKey = () => {
    const randomKey = 'tnet_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('trustnet_dev_apikey', randomKey)
    setApiKey(randomKey)
    setCopied(false)
  }

  const handleCopyKey = () => {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
      
      {/* 1. System Preferences Controls */}
      <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>System Preferences</h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>Configure forensic automation settings</p>
        </div>

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: 8, color: '#a7f3d0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={14} style={{ color: '#10b981' }} />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Slider Row 1 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Automated Forensic Scan</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', marginTop: 2 }}>Triggers validation routines instantly on upload drop</div>
            </div>
            <input 
              type="checkbox" 
              checked={autoScan}
              onChange={(e) => setAutoScan(e.target.checked)}
              style={{ width: 36, height: 18, cursor: 'pointer' }}
            />
          </div>

          {/* Slider Row 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>High-Risk Email Alerts</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', marginTop: 2 }}>Sends automated notifications to admins on 70%+ fraud warnings</div>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: 36, height: 18, cursor: 'pointer' }}
            />
          </div>

          {/* Selector Row 3 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Visual Portal Theme</div>
              <div style={{ fontSize: 11, color: 'hsl(var(--text-muted))', marginTop: 2 }}>Adjust dashboard visual rendering scheme</div>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="auth-input"
              style={{ width: 100, padding: '4px 8px', fontSize: 12 }}
            >
              <option value="dark">Dark Glow</option>
              <option value="light">Light Slate</option>
            </select>
          </div>

          <button 
            onClick={handleSavePreferences}
            className="tab-button active"
            style={{ width: '100%', padding: '12px' }}
          >
            Save System Preferences
          </button>
        </div>
      </div>

      {/* 2. Developer API Token Generation */}
      <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Developer Portal</h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))' }}>Access API endpoints from external apps</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))', lineHeight: 1.5 }}>
            Generate a private access token to authorize HTTP requests on `/analyze` from internal scripts or command terminals.
          </p>

          {apiKey ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="auth-label">Live API Access Key</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  className="auth-input" 
                  value={apiKey} 
                  readOnly 
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
                <button 
                  onClick={handleCopyKey}
                  className="tab-button"
                  style={{ padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Copy Key"
                >
                  <Copy size={14} style={{ color: copied ? '#10b981' : '#fff' }} />
                </button>
              </div>
              {copied && (
                <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>Access key copied to clipboard!</span>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, color: 'hsl(var(--text-muted))', fontSize: 12 }}>
              No API credentials generated yet
            </div>
          )}

          <button 
            onClick={handleGenerateKey}
            className="tab-button"
            style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <RefreshCw size={14} /> {apiKey ? 'Regenerate API Key' : 'Generate API Key'}
          </button>
        </div>
      </div>

    </div>
  )
}
