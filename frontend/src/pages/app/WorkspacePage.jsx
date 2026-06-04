import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Shield, Cpu, Database, FileText, Globe, AlertTriangle, ArrowRight, Layers } from 'lucide-react'
import UploadZone from '../../components/UploadZone'
import ReportCard from '../../components/ReportCard'
import LayerBreakdown from '../../components/LayerBreakdown'
import NetworkPanel from '../../components/NetworkPanel'
import { useAuth } from '../../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function WorkspacePage() {
  const { session } = useAuth()
  const [docFiles, setDocFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [netReport, setNetReport] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("document")
  const [activeBatchIndex, setActiveBatchIndex] = useState(0)

  // Load latest run from history on load if available
  useEffect(() => {
    try {
      const cached = localStorage.getItem("trustnet_history")
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed.length > 0) {
          setReport(parsed[0].reportData)
          setNetReport(parsed[0].netReportData)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Sync to local history cache
  const addToHistory = (filename, score, isBatch, reportData, netReportData) => {
    const newItem = {
      id: Date.now().toString(),
      filename,
      score,
      isBatch,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      reportData,
      netReportData
    }
    
    try {
      const cached = localStorage.getItem("trustnet_history")
      const history = cached ? JSON.parse(cached) : []
      const updated = [newItem, ...history.slice(0, 19)] // Keep last 20
      localStorage.setItem("trustnet_history", JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleAnalyze = async () => {
    if (docFiles.length === 0) return
    setLoading(true)
    setError(null)
    setReport(null)
    setNetReport(null)
    setActiveBatchIndex(0)

    // Prepare auth headers if JWT token exists
    const headers = {}
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    try {
      if (docFiles.length === 1) {
        // --- Single Scan Flow ---
        const file = docFiles[0]
        const form = new FormData()
        form.append("file", file)

        const [docRes, netRes] = await Promise.all([
          axios.post(`${API_BASE}/analyze`, form, { headers }),
          axios.post(`${API_BASE}/network/analyze`, form, { headers })
        ])

        const resData = docRes.data
        setReport(resData)
        setNetReport(netRes.data)
        
        addToHistory(
          file.name, 
          resData.report.combined_risk_score, 
          false, 
          resData, 
          netRes.data
        )
      } else {
        // --- Batch Scan Flow (>= 2 files) ---
        const batchForm = new FormData()
        docFiles.forEach(file => {
          batchForm.append("files", file)
        })

        const netForm = new FormData()
        netForm.append("file", docFiles[0])

        const [docRes, netRes] = await Promise.all([
          axios.post(`${API_BASE}/analyze/batch`, batchForm, { headers }),
          axios.post(`${API_BASE}/network/analyze`, netForm, { headers })
        ])

        const resData = docRes.data
        setReport(resData)
        setNetReport(netRes.data)
        
        addToHistory(
          `Batch Analysis (${docFiles.length} files)`, 
          resData.batch_risk_score, 
          true, 
          resData, 
          netRes.data
        )
      }
      setDocFiles([]) // Clear file list
    } catch (e) {
      console.error(e)
      setError("Analysis failed. Verify that your local FastAPI backend is active on port 8000.")
    } finally {
      setLoading(false)
    }
  }

  const isBatchMode = report && report.documents_analyzed !== undefined
  
  const activeReport = isBatchMode
    ? {
        report: report.per_document[activeBatchIndex].report,
        layers: report.per_document[activeBatchIndex].layers
      }
    : report

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Visual Intake Dropzone */}
      <UploadZone
        file={docFiles.length === 1 ? docFiles[0] : null}
        filesList={docFiles}
        onFileSelect={(file) => setDocFiles([file])}
        onFilesSelect={(files) => setDocFiles(files)}
        onClearFiles={() => setDocFiles([])}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {/* Errors banner */}
      {error && (
        <div className="animate-fade-in" style={{
          background: "var(--danger-glow)",
          border: "1px solid var(--danger-border)",
          borderRadius: 12,
          padding: "14px 18px",
          color: "#fca5a5",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <AlertTriangle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{error}</span>
        </div>
      )}

      {/* Main Dashboard Render */}
      {report ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Tab Selection */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            paddingBottom: 16,
            flexWrap: "wrap",
            gap: 12
          }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                <Database size={16} style={{ color: "#6366f1" }} /> Analysis Dashboard
              </h2>
              <p style={{ fontSize: 12, color: "hsl(var(--text-secondary))", marginTop: 2 }}>
                {isBatchMode 
                  ? `Cross-referencing entity networks between ${report.documents_analyzed} files` 
                  : `Intake results for '${report.filename}'`}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => setActiveTab("document")}
                className={`tab-button ${activeTab === "document" ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <FileText size={14} /> Document Analysis
              </button>
              <button 
                onClick={() => setActiveTab("network")}
                className={`tab-button ${activeTab === "network" ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Globe size={14} /> Network Security
              </button>
            </div>
          </div>

          {/* Document forensic layout */}
          {activeTab === "document" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Batch files swapper */}
              {isBatchMode && (
                <div className="glass-card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--text-secondary))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Inspect File in Batch:
                  </span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {report.per_document.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBatchIndex(idx)}
                        className={`tab-button ${activeBatchIndex === idx ? "active" : ""}`}
                        style={{ padding: "6px 12px", fontSize: 12, borderRadius: 6 }}
                      >
                        {doc.filename}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Report cards */}
              <ReportCard report={activeReport.report} isBatch={isBatchMode} batchGnn={isBatchMode ? report : null} />
              
              {/* Interactive sub-panels */}
              <LayerBreakdown report={activeReport.report} layersData={activeReport.layers} />
              
            </div>
          )}

          {/* Network Threat posture */}
          {activeTab === "network" && netReport && (
            <div className="animate-fade-in">
              <NetworkPanel data={netReport} />
            </div>
          )}

        </div>
      ) : (
        /* Empty default onboarding panel */
        <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64,
              background: "rgba(99, 102, 241, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.12)",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#6366f1"
            }}>
              <Layers size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Intake Workspace Ready</h3>
              <p style={{ fontSize: 13, color: "hsl(var(--text-secondary))", marginTop: 6, lineHeight: 1.6 }}>
                Drag and drop a PDF pay slip, bank statement, or transaction spreadsheet to run a forensic sweep across ELA and Benford analysis.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
