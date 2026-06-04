import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ShieldAlert, FileText, ArrowRight, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = () => {
    try {
      const cached = localStorage.getItem("trustnet_history")
      if (cached) {
        const history = JSON.parse(cached)
        const aggregatedAlerts = []

        history.forEach(scan => {
          const report = scan.reportData?.report
          if (report?.prioritised_flags) {
            report.prioritised_flags.forEach(flag => {
              aggregatedAlerts.push({
                id: Math.random().toString(),
                filename: scan.filename,
                scanId: scan.id,
                layer: flag.layer,
                message: flag.flag,
                severity: flag.severity,
                time: scan.timestamp,
                date: scan.date
              })
            })
          }
        })

        setAlerts(aggregatedAlerts)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleClearAlerts = () => {
    // Only clears local view, doesn't erase history list
    setAlerts([])
  }

  return (
    <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 10 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} style={{ color: '#f59e0b' }} /> Alert Notification Center
          </h2>
          <p style={{ fontSize: 12, color: 'hsl(var(--text-secondary))', marginTop: 2 }}>Aggregated list of high-severity warning flags triggered by forensic runs</p>
        </div>
        {alerts.length > 0 && (
          <button 
            onClick={handleClearAlerts}
            style={{ background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 }}
          >
            <Trash2 size={12} /> Clear Alerts View
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'hsl(var(--text-muted))', fontSize: 13 }}>
          No high-priority alerts triggered. Documents scanned so far appear clean.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className="glass-card"
              style={{
                padding: '14px 20px',
                background: alert.severity === 'high' ? 'rgba(244, 63, 94, 0.03)' : 'rgba(245, 158, 11, 0.03)',
                border: `1px solid ${alert.severity === 'high' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260, flex: 1 }}>
                <ShieldAlert size={18} style={{ color: alert.severity === 'high' ? '#f43f5e' : '#f59e0b', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    [{alert.layer}] {alert.message}
                  </div>
                  <div style={{ fontSize: 10, color: 'hsl(var(--text-muted))', marginTop: 3, display: 'flex', gap: 10 }}>
                    <span>File: <strong>{alert.filename}</strong></span>
                    <span>&bull;</span>
                    <span>{alert.date} at {alert.time}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  try {
                    const cached = localStorage.getItem("trustnet_history")
                    if (cached) {
                      const parsed = JSON.parse(cached)
                      const target = parsed.find(x => x.id === alert.scanId)
                      if (target) {
                        const filtered = parsed.filter(x => x.id !== alert.scanId)
                        localStorage.setItem("trustnet_history", JSON.stringify([target, ...filtered]))
                      }
                    }
                  } catch (e) {
                    console.error(e)
                  }
                  navigate('/workspace')
                }}
                className="tab-button"
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                Inspect <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
