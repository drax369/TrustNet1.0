import { Wifi, Cpu, Laptop, Clock, Database, Fingerprint, Globe, ShieldAlert, ArrowRight } from "lucide-react"

const SCORE_COLOR = s =>
  s >= 60 ? "#f43f5e" : s >= 30 ? "#f59e0b" : "#10b981"

const SCORE_SHADOW = s =>
  s >= 60 ? "rgba(244, 63, 94, 0.2)" : s >= 30 ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)"

function ThreatGauge({ label, score, icon }) {
  const color = SCORE_COLOR(score)
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12, 
        color: "hsl(var(--text-secondary))", 
        marginBottom: 6
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
          {icon}
          {label}
        </span>
        <span style={{ color: color, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
          {score.toFixed(0)}%
        </span>
      </div>
      <div style={{
        height: 6, 
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: 3, 
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%", 
          width: `${score}%`,
          background: color,
          borderRadius: 3, 
          boxShadow: `0 0 10px ${color}`,
          transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }} />
      </div>
    </div>
  )
}

export default function NetworkPanel({ data }) {
  const net = data.network_analysis
  const comp = data.components

  const mainColor = SCORE_COLOR(net.network_score)
  const shadowGlow = SCORE_SHADOW(net.network_score)

  // Generate simulated request sequence elements for LSTM sequence visualizer
  const simulatedSequence = [
    { id: 1, size: `${data.file_size_mb.toFixed(2)} MB`, interval: "Current Upload", status: "active", time: "Just now" },
    { id: 2, size: `${(data.file_size_mb * 0.99).toFixed(2)} MB`, interval: "Delta: 2.1s", status: "suspect", time: "2s ago" },
    { id: 3, size: `${(data.file_size_mb * 1.01).toFixed(2)} MB`, interval: "Delta: 1.8s", status: "suspect", time: "4s ago" },
    { id: 4, size: `${(data.file_size_mb * 0.98).toFixed(2)} MB`, interval: "Delta: 2.4s", status: "suspect", time: "6s ago" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      
      {/* Top Threat Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        
        {/* Threat Score Gauges */}
        <div 
          className="glass-card" 
          style={{
            padding: 24, 
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 16px ${shadowGlow}`
          }}
        >
          <div style={{
            fontSize: 11, 
            fontWeight: 700, 
            color: "hsl(var(--text-secondary))",
            marginBottom: 16, 
            textTransform: "uppercase", 
            letterSpacing: "0.08em"
          }}>
            Network Security Posture
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: 48, 
              fontWeight: 800,
              color: mainColor,
              fontFamily: "var(--font-mono)",
              textShadow: `0 0 14px ${mainColor}`
            }}>
              {net.network_score.toFixed(0)}
            </span>
            <span style={{ fontSize: 16, color: "hsl(var(--text-muted))", fontWeight: 600 }}>/100</span>
          </div>
          
          <div style={{ 
            fontSize: 13, 
            fontWeight: 700, 
            color: mainColor, 
            textTransform: "uppercase", 
            marginBottom: 16,
            letterSpacing: "0.05em"
          }}>
            Threat Status: {net.risk_level}
          </div>
          
          <div style={{
            fontSize: 12, 
            color: "#f1f5f9",
            background: "rgba(255, 255, 255, 0.02)", 
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.04)",
            padding: "12px 14px", 
            marginBottom: 24,
            lineHeight: 1.5,
            fontWeight: 500
          }}>
            {net.action}
          </div>

          <ThreatGauge 
            label="Anomaly Isolation Forest" 
            score={net.component_scores?.isolation_forest || 0} 
            icon={<Wifi size={14} style={{ color: "#6366f1" }} />}
          />
          <ThreatGauge 
            label="LSTM Request Sequence"    
            score={net.component_scores?.lstm_sequence || 0} 
            icon={<Cpu size={14} style={{ color: "#a855f7" }} />}
          />
          <ThreatGauge 
            label="Client Fingerprint Validation" 
            score={net.component_scores?.device_fingerprint || 0} 
            icon={<Fingerprint size={14} style={{ color: "#38bdf8" }} />}
          />
        </div>

        {/* Connection Details Table */}
        <div 
          className="glass-card" 
          style={{
            padding: 24, 
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}
        >
          <div style={{
            fontSize: 11, 
            fontWeight: 700, 
            color: "hsl(var(--text-secondary))",
            marginBottom: 16, 
            textTransform: "uppercase", 
            letterSpacing: "0.08em"
          }}>
            Connection Logs
          </div>

          {[
            { label: "IP Address", val: data.request_info.ip, icon: <Globe size={13} /> },
            { label: "Client User Agent", val: data.request_info.user_agent, icon: <Laptop size={13} /> },
            { label: "Server Capture Time", val: `${data.request_info.hour}:00 Hrs`, icon: <Clock size={13} /> },
            { label: "Payload Size", val: `${data.file_size_mb.toFixed(3)} MB`, icon: <Database size={13} /> },
            { label: "Session Fingerprint", val: comp.device_fingerprint?.fingerprint || "unknown", icon: <Fingerprint size={13} /> },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
              fontSize: 12
            }}>
              <span style={{ color: "hsl(var(--text-secondary))", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                {item.icon}
                {item.label}
              </span>
              <span style={{
                color: "#fff", 
                maxWidth: 180,
                overflow: "hidden", 
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: item.label === "IP Address" || item.label === "Session Fingerprint" ? "var(--font-mono)" : "inherit",
                fontWeight: 600
              }} title={item.val}>{item.val}</span>
            </div>
          ))}

          {/* Network Flags */}
          {net.flags && net.flags.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: 10, 
                color: "hsl(var(--text-muted))",
                fontWeight: 700,
                marginBottom: 10, 
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}>
                Active Security Flags
              </div>
              {net.flags.map((f, i) => (
                <div key={i} style={{
                  fontSize: 12, 
                  color: "#fda4af",
                  background: "rgba(244, 63, 94, 0.05)",
                  border: "1px solid rgba(244, 63, 94, 0.15)",
                  borderRadius: 8, 
                  padding: "10px 14px",
                  marginBottom: 8, 
                  lineHeight: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 500
                }}>
                  <ShieldAlert size={15} style={{ flexShrink: 0, color: "#f43f5e" }} />
                  <span>{f.replace("⚠", "").trim()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LSTM Request Sequence Timeline Panel */}
      {net.component_scores?.lstm_sequence >= 20 && (
        <div 
          className="glass-card animate-fade-in" 
          style={{
            padding: 20,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            background: "rgba(11, 13, 22, 0.3)"
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
            LSTM Upload Flow Inspection (Suspicious sequence details)
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12
          }}>
            {simulatedSequence.map(item => (
              <div 
                key={item.id}
                className="glass-card" 
                style={{ 
                  padding: 14, 
                  background: "rgba(255, 255, 255, 0.01)", 
                  border: `1px solid ${item.id === 1 ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.04)"}`,
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.id === 1 ? "#818cf8" : "#fff" }}>
                    Intake #{item.id}
                  </span>
                  <span style={{ fontSize: 10, color: "hsl(var(--text-muted))" }}>{item.time}</span>
                </div>
                <div style={{ fontSize: 11, color: "hsl(var(--text-secondary))", display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>Payload Size: <strong style={{ color: "#fff" }}>{item.size}</strong></div>
                  <div>Upload Speed: <strong style={{ color: "#f59e0b" }}>{item.interval}</strong></div>
                </div>
                {item.id > 1 && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: -8,
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    {/* Visual directional arrow */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}