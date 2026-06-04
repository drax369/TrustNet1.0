import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, Activity, FileText, CheckCircle, Clock, Trash2, ArrowRight, ShieldAlert } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MOCK_CLEAN_REPORT, MOCK_FRAUD_REPORT, MOCK_NET_REPORT } from '../../mockData'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loadingPreset, setLoadingPreset] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const cached = localStorage.getItem("trustnet_history")
      if (cached) {
        setHistory(JSON.parse(cached))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleClearHistory = () => {
    localStorage.removeItem("trustnet_history")
    setHistory([])
  }

  // Load a demo preset
  const handleLoadDemo = (type) => {
    setLoadingPreset(true)
    setTimeout(() => {
      let selectedReport = null
      let filename = ""
      
      if (type === "clean") {
        selectedReport = MOCK_CLEAN_REPORT
        filename = "Salary_Slip_May2026.pdf"
      } else {
        selectedReport = MOCK_FRAUD_REPORT
        filename = "Bank_Statement_Q1.pdf"
      }

      // Add to history
      const newItem = {
        id: Date.now().toString(),
        filename,
        score: selectedReport.report.combined_risk_score,
        isBatch: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        reportData: selectedReport,
        netReportData: MOCK_NET_REPORT
      }

      try {
        const cached = localStorage.getItem("trustnet_history")
        const currentHistory = cached ? JSON.parse(cached) : []
        const updated = [newItem, ...currentHistory.slice(0, 19)]
        localStorage.setItem("trustnet_history", JSON.stringify(updated))
        setHistory(updated)
      } catch (e) {
        console.error(e)
      }

      setLoadingPreset(false)
      navigate('/workspace') // Redirect to workspace to show report
    }, 600)
  }

  // Statistics
  const totalRuns = history.length
  const avgRisk = totalRuns > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalRuns) 
    : 0
  const cleanRuns = history.filter(item => item.score < 30).length
  const suspiciousRuns = history.filter(item => item.score >= 30).length

  // Generate chart data based on history or defaults
  const chartData = history.length >= 3
    ? [...history].reverse().map((item, idx) => ({ name: `Scan #${idx+1}`, Risk: item.score }))
    : [
        { name: 'May 28', Risk: 8 },
        { name: 'May 29', Risk: 12 },
        { name: 'May 30', Risk: 76 },
        { name: 'May 31', Risk: 5 },
        { name: 'Jun 01', Risk: 45 },
        { name: 'Jun 02', Risk: 9 },
        { name: 'Jun 03', Risk: avgRisk || 15 },
      ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* SaaS Statistics Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        
        <div className="glass-card stat-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <span style={{ fontSize: 10, color: "hsl(var(--text-secondary))", fontWeight: 700, textTransform: 'uppercase' }}>Total Sweeps Run</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "var(--font-mono)" }}>{totalRuns}</span>
            <FileText size={20} style={{ color: '#818cf8' }} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <span style={{ fontSize: 10, color: "hsl(var(--text-secondary))", fontWeight: 700, textTransform: 'uppercase' }}>Average Risk index</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: avgRisk >= 60 ? "#f43f5e" : avgRisk >= 30 ? "#f59e0b" : "#10b981", fontFamily: "var(--font-mono)" }}>
              {avgRisk}%
            </span>
            <Activity size={20} style={{ color: '#a855f7' }} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <span style={{ fontSize: 10, color: "hsl(var(--text-secondary))", fontWeight: 700, textTransform: 'uppercase' }}>Clean Appraisals</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: "#10b981", fontFamily: "var(--font-mono)" }}>{cleanRuns}</span>
            <CheckCircle size={20} style={{ color: '#10b981' }} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <span style={{ fontSize: 10, color: "hsl(var(--text-secondary))", fontWeight: 700, textTransform: 'uppercase' }}>Active Alerts Flagged</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b', fontFamily: "var(--font-mono)" }}>{suspiciousRuns}</span>
            <ShieldAlert size={20} style={{ color: '#f59e0b' }} />
          </div>
        </div>

      </div>

      {/* Recharts chart & presets side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, alignItems: 'stretch' }}>
        
        {/* Recharts chart card */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Historical Scan Risk Trends
          </div>
          <div style={{ height: 200, width: '100%', marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="name" stroke="hsl(var(--text-muted))" fontSize={10} />
                <YAxis stroke="hsl(var(--text-muted))" fontSize={10} unit="%" />
                <Tooltip 
                  contentStyle={{ background: '#0e111d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="Risk" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sandbox Presets */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyItems: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Simulation Presets
            </div>
            <p style={{ fontSize: 12, color: 'hsl(var(--text-muted))', lineHeight: 1.4 }}>
              Instantly generate mock document scans into your logs to evaluate warning score displays.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1, justifyContent: 'center' }}>
            <button 
              onClick={() => handleLoadDemo("clean")}
              disabled={loadingPreset}
              className="tab-button"
              style={{ padding: "10px", width: "100%", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              Load Clean Pay Slip
            </button>
            <button 
              onClick={() => handleLoadDemo("fraud")}
              disabled={loadingPreset}
              className="tab-button"
              style={{ padding: "10px", width: "100%", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e" }} />
              Load Fraud Statement
            </button>
          </div>
        </div>

      </div>

      {/* Scan History Table Logs */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Forensic Audits
          </div>
          {history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              style={{ background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600 }}
            >
              <Trash2 size={12} /> Clear Logs
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'hsl(var(--text-muted))', fontSize: 13 }}>
            No recent document audits found. Navigate to the Intake Workspace to run scans.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ minWidth: 500 }}>
              <thead>
                <tr>
                  <th>Audit Target</th>
                  <th>Date &amp; Time</th>
                  <th>Audit Type</th>
                  <th>Risk Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{item.filename}</td>
                    <td>{item.date} at {item.timestamp}</td>
                    <td>{item.isBatch ? 'Batch Cross-check' : 'Single Document'}</td>
                    <td>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        background: item.score >= 60 ? 'rgba(244,63,94,0.06)' : item.score >= 30 ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)',
                        color: item.score >= 60 ? '#f43f5e' : item.score >= 30 ? '#f59e0b' : '#10b981',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}>
                        {item.score.toFixed(0)}%
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          // Swap active view to this report
                          try {
                            const cached = localStorage.getItem("trustnet_history")
                            if (cached) {
                              const parsed = JSON.parse(cached)
                              const selected = parsed.find(x => x.id === item.id)
                              if (selected) {
                                // Put it first in history so workspace loads it on load
                                const filtered = parsed.filter(x => x.id !== item.id)
                                localStorage.setItem("trustnet_history", JSON.stringify([selected, ...filtered]))
                              }
                            }
                          } catch (e) {
                            console.error(e)
                          }
                          navigate('/workspace')
                        }}
                        style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        Inspect <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
