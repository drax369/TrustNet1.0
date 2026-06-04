import { useState } from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, HelpCircle, Terminal as TerminalIcon, ChevronDown, ChevronUp, Image as ImageIcon, Binary, Tag, Brain, Share2, Clipboard, ShieldCheck } from "lucide-react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const STATUS_CONFIG = {
  high: {
    bg: "rgba(244, 63, 94, 0.03)",
    border: "rgba(244, 63, 94, 0.15)",
    text: "#fda4af",
    bar: "#f43f5e",
    icon: <AlertCircle size={16} style={{ color: "#f43f5e" }} />
  },
  medium: {
    bg: "rgba(245, 158, 11, 0.03)",
    border: "rgba(245, 158, 11, 0.15)",
    text: "#fde047",
    bar: "#f59e0b",
    icon: <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
  },
  clean: {
    bg: "rgba(16, 185, 129, 0.03)",
    border: "rgba(16, 185, 129, 0.15)",
    text: "#a7f3d0",
    bar: "#10b981",
    icon: <CheckCircle2 size={16} style={{ color: "#10b981" }} />
  },
  skipped: {
    bg: "rgba(255, 255, 255, 0.01)",
    border: "rgba(255, 255, 255, 0.05)",
    text: "hsl(var(--text-muted))",
    bar: "#334155",
    icon: <HelpCircle size={16} style={{ color: "hsl(var(--text-muted))" }} />
  }
}

// Sub-component for individual layer row detail inspection
function LayerDetails({ layerKey, data }) {
  if (!data) return <div style={{ fontSize: 12, color: "hsl(var(--text-muted))", padding: 10 }}>No statistical details available for this layer.</div>

  switch (layerKey) {
    case "ela":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeInUp 0.25s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>
            Page Forensics Grid ({data.pages_analyzed} pages)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {data.page_results?.map((p, idx) => (
              <div key={idx} className="glass-card" style={{ padding: 14, background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Page {p.page}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: p.ela_score > 30 ? "#f43f5e" : "#10b981",
                    background: p.ela_score > 30 ? "rgba(244,63,94,0.06)" : "rgba(16,185,129,0.06)",
                    padding: "2px 6px",
                    borderRadius: 4
                  }}>ELA Score: {p.ela_score}%</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11, color: "hsl(var(--text-secondary))", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
                  <div>Mean ELA: {p.mean_ela}</div>
                  <div>Max ELA: {p.max_ela}</div>
                  <div>Std Dev: {p.std_ela}</div>
                  <div>Susp Ratio: {p.suspicious_pixel_ratio}</div>
                </div>
                <div style={{ fontSize: 11, color: p.ela_score > 30 ? "#fda4af" : "#a7f3d0", lineHeight: 1.4 }}>
                  &bull; {p.findings?.[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "benfords":
      if (data.skipped) {
        return <div style={{ fontSize: 12, color: "hsl(var(--text-muted))" }}>Skipped: {data.findings?.[0]}</div>
      }
      
      // Build data array for Recharts ComposedChart
      const digitsData = Array.from({ length: 9 }, (_, idx) => {
        const d = idx + 1
        return {
          digit: d.toString(),
          Observed: (data.observed_distribution?.[d] || 0) * 100,
          Expected: (data.expected_distribution?.[d] || 0) * 100
        }
      })

      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, animation: "fadeInUp 0.25s ease" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", marginBottom: 12 }}>
              Observed vs Expected Digit Ratios (%)
            </div>
            <div style={{ height: 200, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={digitsData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="digit" stroke="hsl(var(--text-muted))" fontSize={11} />
                  <YAxis stroke="hsl(var(--text-muted))" fontSize={11} unit="%" />
                  <Tooltip 
                    contentStyle={{ background: "#141722", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 8, fontSize: 11 }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, marginTop: 10 }} />
                  <Bar dataKey="Observed" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                  <Line type="monotone" dataKey="Expected" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>
              Mathematical Chi2 Statistics
            </div>
            <div className="glass-card" style={{ padding: 16, background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)", fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ color: "hsl(var(--text-muted))" }}>Numbers Analyzed</span>
                <span style={{ fontWeight: 600, color: "#fff", fontFamily: "var(--font-mono)" }}>{data.numbers_analyzed}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ color: "hsl(var(--text-muted))" }}>Chi-Square Stat</span>
                <span style={{ fontWeight: 600, color: "#fff", fontFamily: "var(--font-mono)" }}>{data.chi2_statistic}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ color: "hsl(var(--text-muted))" }}>Confidence p-value</span>
                <span style={{ fontWeight: 600, color: data.p_value < 0.05 ? "#f43f5e" : "#10b981", fontFamily: "var(--font-mono)" }}>{data.p_value}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ color: "hsl(var(--text-muted))" }}>Mean Abs Deviation (MAD)</span>
                <span style={{ fontWeight: 600, color: "#fff", fontFamily: "var(--font-mono)" }}>{data.mean_absolute_deviation}</span>
              </div>
            </div>
            {data.findings?.map((f, i) => (
              <div key={i} style={{ fontSize: 12, color: data.benfords_score >= 30 ? "#fda4af" : "#a7f3d0", lineHeight: 1.4 }}>
                &bull; {f}
              </div>
            ))}
          </div>
        </div>
      )

    case "metadata":
      const metaPairs = Object.entries(data.raw_metadata || {})
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeInUp 0.25s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>
            Raw File Metadata Dictionary
          </div>
          {metaPairs.length === 0 ? (
            <div style={{ fontSize: 12, color: "hsl(var(--text-muted))" }}>No raw metadata keys returned (likely stripped from file).</div>
          ) : (
            <div className="glass-card" style={{ overflow: "hidden", background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Metadata Descriptor Key</th>
                    <th>Extracted Value</th>
                  </tr>
                </thead>
                <tbody>
                  {metaPairs.map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ fontWeight: 600, color: "#818cf8", fontFamily: "var(--font-mono)" }}>{k}</td>
                      <td style={{ fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )

    case "nlp":
      const entities = Object.entries(data.entities_found || {})
      // Extract specific warnings or semantic sentences
      const semanticOutliers = data.findings?.filter(f => f.includes("⚠") || f.includes("conflict")) || []
      
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeInUp 0.25s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {/* Entities Found */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", marginBottom: 10 }}>
                Entity Extractor Summary
              </div>
              <div className="glass-card" style={{ padding: 14, background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)", fontSize: 12 }}>
                {entities.length === 0 ? (
                  <span style={{ color: "hsl(var(--text-muted))" }}>No compliance entities extracted</span>
                ) : (
                  entities.map(([k, v]) => (
                    <div key={k} style={{ padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "hsl(var(--text-muted))", textTransform: "capitalize" }}>{k.replace("_", " ")}</span>
                      <span style={{ fontWeight: 600, color: "#fff" }}>{Array.isArray(v) ? v.join(", ") : v}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Document Context classification */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", marginBottom: 10 }}>
                Document Context Classifier
              </div>
              <div className="glass-card" style={{ padding: 14, background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)", fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                <div>Classified Type: <strong style={{ color: "#a855f7" }}>{data.document_type?.replace("_", " ").toUpperCase()}</strong></div>
                <div>Sentences Checked: <strong style={{ color: "#fff" }}>{data.sentences_analyzed}</strong></div>
                <div>Total Alert Triggers: <strong style={{ color: data.nlp_score >= 30 ? "#f43f5e" : "#10b981" }}>{data.warnings_found}</strong></div>
              </div>
            </div>
          </div>

          {/* Semantic flags list */}
          {semanticOutliers.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", marginBottom: 10 }}>
                Semantic Outlier Sentences
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {semanticOutliers.map((o, idx) => (
                  <div key={idx} style={{
                    fontSize: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(245, 158, 11, 0.05)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    color: "#fde047",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <AlertTriangle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                    <span>{o.replace("⚠", "").trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )

    case "gnn":
      if (data.skipped) {
        return <div style={{ fontSize: 12, color: "hsl(var(--text-muted))" }}>Skipped: {data.findings?.[0]}</div>
      }
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeInUp 0.25s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase" }}>
            Extracted Document Entity Relationships
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {data.document_profiles?.map((p, idx) => (
              <div key={idx} className="glass-card" style={{ padding: 16, background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 6, marginBottom: 10 }}>
                  {p.document}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, fontSize: 11, color: "hsl(var(--text-secondary))" }}>
                  <div>Names: <span style={{ color: "#fff" }}>{p.names_found?.join(", ") || "None"}</span></div>
                  <div>Employers: <span style={{ color: "#fff" }}>{p.employers_found?.join(", ") || "None"}</span></div>
                  <div>PAN Cards: <span style={{ color: "#fff" }}>{p.pan_found?.join(", ") || "None"}</span></div>
                  <div>Aadhaars: <span style={{ color: "#fff" }}>{p.aadhaar_found?.join(", ") || "None"}</span></div>
                  <div>Amounts: <span style={{ color: "#fff" }}>{p.amounts_found?.join(", ") || "None"}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}

function LayerRow({ layer, isExpanded, onToggle, layerData }) {
  const config = STATUS_CONFIG[layer.status] || STATUS_CONFIG.skipped

  const getLayerIcon = (key) => {
    switch (key) {
      case "ela": return <ImageIcon size={14} style={{ color: "#6366f1" }} />
      case "benfords": return <Binary size={14} style={{ color: "#a855f7" }} />
      case "metadata": return <Tag size={14} style={{ color: "#ec4899" }} />
      case "nlp": return <Brain size={14} style={{ color: "#38bdf8" }} />
      case "gnn": return <Share2 size={14} style={{ color: "#10b981" }} />
      default: return <HelpCircle size={14} />
    }
  }

  return (
    <div style={{
      background: config.bg, 
      border: `1px solid ${isExpanded ? "rgba(99, 102, 241, 0.25)" : config.border}`,
      borderRadius: 12, 
      padding: "14px 18px", 
      marginBottom: 12,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: isExpanded ? "0 4px 20px rgba(99, 102, 241, 0.05)" : "none",
      transition: "all 0.2s ease-in-out"
    }}>
      <div 
        onClick={onToggle}
        style={{
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {getLayerIcon(layer.layer_key)}
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>
            {layer.layer}
          </span>
          {config.icon}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            fontSize: 12, 
            color: config.text,
            fontWeight: 700,
            fontFamily: "var(--font-mono)"
          }}>
            {layer.skipped ? "SKIPPED" : `${layer.score}%`}
          </div>
          {isExpanded ? <ChevronUp size={16} style={{ color: "hsl(var(--text-muted))" }} /> : <ChevronDown size={16} style={{ color: "hsl(var(--text-muted))" }} />}
        </div>
      </div>

      {/* Expanded statistical inspect panel */}
      {isExpanded && (
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: 14,
          marginTop: 2
        }}>
          <LayerDetails layerKey={layer.layer_key} data={layerData} />
        </div>
      )}
    </div>
  )
}

function TerminalReport({ reportText }) {
  const parseLogs = (text) => {
    if (!text) return null
    return text.split("\n").map((line, idx) => {
      let color = "hsl(var(--text-secondary))"
      let fontWeight = "400"
      
      if (line.includes("VERDICT: CLEAN") || line.includes("Passed") || line.includes("✓")) {
        color = "#10b981"
        fontWeight = "600"
      } else if (line.includes("VERDICT: HIGH RISK") || line.includes("🔴") || line.includes("KEY RED FLAGS") || line.includes("Strong")) {
        color = "#f43f5e"
        fontWeight = "700"
      } else if (line.includes("VERDICT: SUSPICIOUS") || line.includes("🟡") || line.includes("⚠") || line.includes("Moderate")) {
        color = "#f59e0b"
        fontWeight = "600"
      } else if (line.includes("TRUSTNET ANALYSIS REPORT") || line.includes("LAYER BREAKDOWN")) {
        color = "#818cf8"
        fontWeight = "700"
      } else if (line.startsWith("Generated:") || line.startsWith("─")) {
        color = "hsl(var(--text-muted))"
      }

      return (
        <div key={idx} style={{ color, fontWeight, minHeight: "1.5em", display: "flex", alignItems: "center" }}>
          {line}
        </div>
      )
    })
  }

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(reportText)
    alert("Officer Report copied to clipboard!")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Terminal Header */}
      <div style={{
        background: "#08090d",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderBottom: "none",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{
            fontSize: 11,
            color: "hsl(var(--text-secondary))",
            marginLeft: 12,
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <TerminalIcon size={12} style={{ color: "#6366f1" }} /> trustnet_officer_console.sh
          </span>
        </div>
        <button
          onClick={handleCopyLogs}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 4,
            color: "hsl(var(--text-secondary))",
            padding: "2px 8px",
            fontSize: 9,
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "var(--font-mono)"
          }}
        >
          <Clipboard size={10} /> COPY
        </button>
      </div>

      {/* Terminal Screen */}
      <div 
        className="security-terminal" 
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          flexGrow: 1,
          maxHeight: 380,
          overflowY: "auto",
          boxShadow: "inset 0 4px 20px rgba(0,0,0,0.6)"
        }}
      >
        <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.6, fontFamily: "var(--font-mono)" }}>
          {parseLogs(reportText)}
        </pre>
      </div>
    </div>
  )
}

export default function LayerBreakdown({ report, layersData }) {
  // Keeps track of which layer keys are expanded in the diagnostics list
  const [expandedLayer, setExpandedLayer] = useState("ela") // Default ELA expanded

  function handleToggleLayer(key) {
    setExpandedLayer(expandedLayer === key ? null : key)
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>

      {/* Forensic Diagnostics Card */}
      <div 
        className="glass-card" 
        style={{
          padding: 24, 
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column"
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
          Interactive Diagnostic Inspection
        </div>
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          {report.layer_health.map(layer => (
            <LayerRow 
              key={layer.layer_key} 
              layer={layer} 
              isExpanded={expandedLayer === layer.layer_key}
              onToggle={() => handleToggleLayer(layer.layer_key)}
              layerData={layersData?.[layer.layer_key]}
            />
          ))}
        </div>
      </div>

      {/* Explanatory console card */}
      <div 
        className="glass-card" 
        style={{
          padding: 24, 
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column"
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
          Human Explainable Verdict Logs
        </div>
        
        <div style={{ flexGrow: 1 }}>
          <TerminalReport reportText={report.plain_english_report} />
        </div>
      </div>

    </div>
  )
}