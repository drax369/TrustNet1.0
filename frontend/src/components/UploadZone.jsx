import { useRef, useState } from "react"
import { Upload, FileText, Loader2, FileCheck, ShieldAlert, X, Files } from "lucide-react"

export default function UploadZone({ file, filesList, onFileSelect, onFilesSelect, onClearFiles, onAnalyze, loading }) {
  const inputRef = useRef()
  const [dragActive, setDragActive] = useState(false)

  // Handle file drop (single or multiple)
  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 1) {
      onFileSelect(files[0])
    } else if (files.length > 1) {
      onFilesSelect(files)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragActive(false)
  }

  // Handle standard file selector change
  function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (files.length === 1) {
      onFileSelect(files[0])
    } else if (files.length > 1) {
      onFilesSelect(files)
    }
  }

  // Remove a single file from the selection list
  function handleRemoveFile(idxToRemove, e) {
    e.stopPropagation()
    if (filesList && filesList.length > 0) {
      const updated = filesList.filter((_, idx) => idx !== idxToRemove)
      if (updated.length === 0) {
        onClearFiles()
      } else if (updated.length === 1) {
        onFileSelect(updated[0])
      } else {
        onFilesSelect(updated)
      }
    } else {
      onClearFiles()
    }
  }

  const hasFiles = (file !== null) || (filesList && filesList.length > 0)
  const currentFiles = filesList && filesList.length > 0 ? filesList : file ? [file] : []

  return (
    <div className="glass-card" style={{ padding: "28px 32px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} style={{ color: "#6366f1" }} /> Document Intake Port
          </h3>
          <p style={{ fontSize: 12, color: "hsl(var(--text-secondary))", marginTop: 2 }}>
            Upload single or multiple financial records to verify authenticity &amp; GNN linkages
          </p>
        </div>
        <div style={{
          fontSize: 10,
          background: "rgba(255, 255, 255, 0.05)",
          color: "hsl(var(--text-secondary))",
          padding: "4px 10px",
          borderRadius: 6,
          fontWeight: 600,
          fontFamily: "var(--font-mono)"
        }}>
          PDF, JPG, PNG &le; 10MB
        </div>
      </div>

      {/* Interactive Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && inputRef.current.click()}
        style={{
          border: `2px dashed ${dragActive ? "#a855f7" : hasFiles ? "rgba(99, 102, 241, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
          borderRadius: 12, 
          padding: "40px 24px",
          textAlign: "center", 
          cursor: loading ? "not-allowed" : "pointer",
          background: dragActive 
            ? "rgba(168, 85, 247, 0.04)" 
            : hasFiles 
              ? "rgba(99, 102, 241, 0.02)" 
              : "rgba(3, 4, 7, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          boxShadow: hasFiles ? "inset 0 0 20px rgba(99, 102, 241, 0.05)" : "none"
        }}
      >
        <input
          ref={inputRef} 
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          style={{ display: "none" }}
          disabled={loading}
          onChange={handleFileChange}
        />
        
        {/* Active scan line overlay */}
        {loading && <div className="scanner-line" />}

        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 50, height: 50,
              background: hasFiles ? "rgba(99, 102, 241, 0.1)" : "rgba(255, 255, 255, 0.02)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justify: "center",
              justifyContent: "center",
              border: `1px solid ${hasFiles ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.06)"}`,
              color: hasFiles ? "#818cf8" : "hsl(var(--text-secondary))"
            }}>
              {currentFiles.length > 1 ? <Files size={24} /> : hasFiles ? <FileCheck size={24} /> : <Upload size={22} />}
            </div>
            
            {!hasFiles ? (
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>
                  Drag &amp; drop document files here
                </div>
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 12, marginTop: 4 }}>
                  or click to select multiple files
                </div>
              </div>
            ) : (
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                  {currentFiles.length} file(s) selected
                </div>
                <div style={{ color: "hsl(var(--text-muted))", fontSize: 11, marginTop: 4 }}>
                  Click to replace or add more files
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Files Card List (Only displayed when files are present) */}
      {currentFiles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 10, color: "hsl(var(--text-muted))", fontWeight: 700, textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>
            File Intake Queue ({currentFiles.length})
          </div>
          <div style={{ display: "grid", gap: 8, maxHeight: 180, overflowY: "auto" }}>
            {currentFiles.map((f, idx) => (
              <div 
                key={idx} 
                className="glass-card animate-fade-in"
                style={{ 
                  background: "rgba(255,255,255,0.01)", 
                  border: "1px solid rgba(255,255,255,0.04)", 
                  borderRadius: 8, 
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 12
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                  <FileText size={14} style={{ color: "#818cf8", flexShrink: 0 }} />
                  <span style={{ color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.name}
                  </span>
                  <span style={{ color: "hsl(var(--text-muted))", fontSize: 10, flexShrink: 0 }}>
                    ({(f.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                {!loading && (
                  <button
                    onClick={(e) => handleRemoveFile(idx, e)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "hsl(var(--text-muted))",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: 2
                    }}
                    title="Remove File"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Trigger Button */}
      <button
        onClick={onAnalyze}
        disabled={!hasFiles || loading}
        style={{
          width: "100%", 
          padding: "14px",
          background: hasFiles && !loading
            ? "var(--accent-gradient)"
            : "rgba(255, 255, 255, 0.02)",
          color: hasFiles && !loading ? "#fff" : "hsl(var(--text-muted))",
          border: "none", 
          borderRadius: 10,
          marginTop: 20,
          fontSize: 14, 
          fontWeight: 700,
          cursor: hasFiles && !loading ? "pointer" : "not-allowed",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: hasFiles && !loading ? "0 4px 20px rgba(99, 102, 241, 0.2)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            <span>Scanning and analyzing document layers...</span>
          </>
        ) : (
          <>
            <ShieldAlert size={18} />
            <span>
              {currentFiles.length > 1 
                ? `Execute TrustNet Batch Check (${currentFiles.length} files)` 
                : "Execute TrustNet Forensic Check"}
            </span>
          </>
        )}
      </button>
    </div>
  )
}