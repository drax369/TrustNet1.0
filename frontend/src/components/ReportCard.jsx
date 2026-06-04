import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertCircle, Clock, Flag, Share2, Info } from "lucide-react"

const CARD_THEMES = {
  red: {
    bg: "rgba(244, 63, 94, 0.04)",
    border: "rgba(244, 63, 94, 0.2)",
    textPrimary: "#fda4af",
    textSecondary: "#f1f5f9",
    accent: "#f43f5e",
    shadow: "rgba(244, 63, 94, 0.15)",
    icon: <ShieldAlert size={28} style={{ color: "#f43f5e" }} />
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.04)",
    border: "rgba(245, 158, 11, 0.2)",
    textPrimary: "#fde047",
    textSecondary: "#f1f5f9",
    accent: "#f59e0b",
    shadow: "rgba(245, 158, 11, 0.12)",
    icon: <AlertTriangle size={28} style={{ color: "#f59e0b" }} />
  },
  green: {
    bg: "rgba(16, 185, 129, 0.04)",
    border: "rgba(16, 185, 129, 0.2)",
    textPrimary: "#6ee7b7",
    textSecondary: "#f1f5f9",
    accent: "#10b981",
    shadow: "rgba(16, 185, 129, 0.12)",
    icon: <ShieldCheck size={28} style={{ color: "#10b981" }} />
  }
}

export default function ReportCard({ report, isBatch, batchGnn }) {
  // If in batch mode, pull overall batch metrics
  const score = isBatch ? batchGnn.batch_risk_score : report.combined_risk_score
  const rawColor = score >= 60 ? "red" : score >= 30 ? "amber" : "green"
  const theme = CARD_THEMES[rawColor]
  
  const riskLevel = isBatch ? batchGnn.batch_risk_level : report.risk_level
  const action = isBatch ? batchGnn.batch_action : report.recommended_action
  const urgency = isBatch ? (score >= 60 ? "Immediate action required" : score >= 30 ? "Review within 24 hours" : "No action required") : report.urgency

  const chartData = [{ value: score, fill: theme.accent }]

  // Extract GNN findings
  const gnnFindings = isBatch && batchGnn.gnn_cross_analysis 
    ? batchGnn.gnn_cross_analysis.findings 
    : []
  const gnnStats = isBatch && batchGnn.gnn_cross_analysis 
    ? batchGnn.gnn_cross_analysis.graph_stats 
    : null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      {/* Primary Score & Verdict Card */}
      <div 
        className="glass-card" 
        style={{
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          padding: "24px 30px",
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 16px ${theme.shadow}`,
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: 28, 
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        {/* Score Radial Gauge */}
        <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="72%" 
              outerRadius="100%"
              data={chartData} 
              startAngle={90} 
              endAngle={90 - (score / 100) * 360}
              barSize={9}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <RadialBar 
                dataKey="value" 
                background={{ fill: "rgba(255, 255, 255, 0.03)" }}
                filter="url(#glow)" 
                cornerRadius={6}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{
            position: "absolute", 
            inset: 0,
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center"
          }}>
            <span style={{
              fontSize: 28, 
              fontWeight: 800, 
              color: "#fff", 
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-mono)",
              textShadow: `0 0 12px ${theme.accent}`
            }}>
              {score.toFixed(0)}
            </span>
            <span style={{ fontSize: 9, color: "hsl(var(--text-muted))", fontWeight: 700, textTransform: "uppercase", marginTop: -2 }}>
              {isBatch ? "Batch Threat" : "Risk Score"}
            </span>
          </div>
        </div>

        {/* Verdict Details */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            {theme.icon}
            <div style={{
              fontSize: 20, 
              fontWeight: 800,
              color: theme.textPrimary,
              letterSpacing: "-0.01em",
              textTransform: "uppercase"
            }}>
              {riskLevel}
            </div>
            {isBatch && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(99, 102, 241, 0.12)",
                color: "#a5b4fc",
                padding: "3px 8px",
                borderRadius: 4,
                border: "1px solid rgba(99, 102, 241, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Batch Scan Mode
              </span>
            )}
          </div>
          
          <p style={{
            fontSize: 14, 
            color: theme.textSecondary,
            marginBottom: 18, 
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            {action}
          </p>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            
            <span style={{
              fontSize: 11, 
              fontWeight: 600,
              padding: "5px 12px",
              background: "rgba(255, 255, 255, 0.03)", 
              color: "hsl(var(--text-secondary))",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid rgba(255, 255, 255, 0.05)"
            }}>
              <Flag size={12} />
              {isBatch 
                ? `${batchGnn.documents_analyzed} documents compared`
                : `${report.flags_summary?.total_flags || 0} flag(s) registered`}
            </span>

            {!isBatch && report.flags_summary?.high_severity > 0 && (
              <span style={{
                fontSize: 11, 
                fontWeight: 700,
                padding: "5px 12px",
                background: "rgba(244, 63, 94, 0.1)", 
                color: "#fda4af",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid rgba(244, 63, 94, 0.2)"
              }}>
                <AlertCircle size={12} />
                {report.flags_summary.high_severity} Critical Risk
              </span>
            )}

            {!isBatch && report.flags_summary?.medium_severity > 0 && (
              <span style={{
                fontSize: 11, 
                fontWeight: 700,
                padding: "5px 12px",
                background: "rgba(245, 158, 11, 0.1)", 
                color: "#fef08a",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                <AlertTriangle size={12} />
                {report.flags_summary.medium_severity} Cautionary
              </span>
            )}

            <span style={{
              fontSize: 11, 
              fontWeight: 600,
              padding: "5px 12px",
              background: "rgba(99, 102, 241, 0.06)", 
              color: "#a5b4fc",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid rgba(99, 102, 241, 0.15)",
              marginLeft: isBatch ? "none" : "auto"
            }}>
              <Clock size={12} />
              {urgency}
            </span>
          </div>
        </div>
      </div>

      {/* Batch GNN Graph Metrics Card (Only in batch scan mode) */}
      {isBatch && batchGnn.gnn_cross_analysis && (
        <div 
          className="glass-card animate-fade-in" 
          style={{
            padding: 20,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            background: "rgba(11, 13, 22, 0.3)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
              <Share2 size={14} style={{ color: "#6366f1" }} /> Cross-Document GNN Analysis
            </span>
            {gnnStats && (
              <span style={{ fontSize: 11, color: "hsl(var(--text-muted))", fontFamily: "var(--font-mono)" }}>
                Nodes: {gnnStats.total_documents} | Connections: {gnnStats.total_edges} | Avg Deg: {gnnStats.avg_degree}
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gnnFindings.map((finding, idx) => {
              const hasWarning = finding.includes("⚠")
              return (
                <div 
                  key={idx} 
                  style={{
                    fontSize: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: hasWarning ? "rgba(244, 63, 94, 0.05)" : "rgba(16, 185, 129, 0.05)",
                    border: `1px solid ${hasWarning ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)"}`,
                    color: hasWarning ? "#fda4af" : "#a7f3d0",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontWeight: 500
                  }}
                >
                  {hasWarning ? (
                    <ShieldAlert size={14} style={{ color: "#f43f5e", flexShrink: 0 }} />
                  ) : (
                    <ShieldCheck size={14} style={{ color: "#10b981", flexShrink: 0 }} />
                  )}
                  <span>{finding.replace("⚠", "").replace("✓", "").trim()}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}