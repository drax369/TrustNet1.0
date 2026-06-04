from fastapi import FastAPI, UploadFile, File, Header, Depends, HTTPException, Request
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from app.layers.ela import analyze_document_ela
from app.layers.benfords import analyze_document_benfords
from app.layers.metadata_forensics import analyze_document_metadata
from app.layers.nlp_analysis import analyze_document_nlp
from app.layers.gnn_analysis import analyze_documents_gnn
from app.utils.risk_aggregator import aggregate_results
from app.network.traffic_analyzer import (
    extract_traffic_features, run_isolation_forest
)
from app.network.lstm_analyzer import record_request, analyze_upload_sequence
from app.network.device_fingerprint import analyze_device_fingerprint
from app.network.network_aggregator import aggregate_network_results
import time
import shutil, os, uuid

async def get_current_user(authorization: str = Header(None)) -> dict:
    """Validate optional JWT bearer token from Supabase or Local Auth Client."""
    if not authorization:
        return {"id": "anonymous", "email": "anonymous@trustnet.ai", "role": "anonymous"}
        
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return {"id": "anonymous", "email": "anonymous@trustnet.ai", "role": "anonymous"}
        
    token = parts[1]
    
    # Detect Local Developer Mock Token
    if token.startswith("mock-jwt-token-"):
        user_id = token.replace("mock-jwt-token-", "")
        return {"id": user_id, "email": "developer-user@trustnet.ai", "role": "developer"}
        
    # Real JWT Token Decryption (if secret key configured in environment)
    jwt_secret = os.environ.get("SUPABASE_JWT_SECRET")
    if jwt_secret:
        try:
            import jwt
            payload = jwt.decode(token, jwt_secret, algorithms=["HS256"], audience="authenticated")
            return {
                "id": payload.get("sub"),
                "email": payload.get("email"),
                "role": payload.get("role", "authenticated")
            }
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid authorization token signature")
            
    return {"id": "authenticated-user", "email": "user@trustnet.ai", "role": "authenticated"}


app = FastAPI(
    title="TrustNet API",
    version="2.0.0",
    description="AI-powered financial document fraud detection"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_file(file: UploadFile) -> str:
    """Save uploaded file and return its path."""
    ext       = os.path.splitext(file.filename)[1]
    file_id   = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path


def run_all_layers(file_path: str, all_paths: list = None) -> dict:
    """Run all 5 detection layers on a document."""
    return {
        "ela":      analyze_document_ela(file_path),
        "benfords": analyze_document_benfords(file_path),
        "metadata": analyze_document_metadata(file_path),
        "nlp":      analyze_document_nlp(file_path),
        "gnn":      analyze_documents_gnn(all_paths or [file_path])
    }


@app.get("/")
def root():
    return {
        "status":    "TrustNet API v2.0 running ✓",
        "endpoints": {
            "single":  "POST /analyze",
            "batch":   "POST /analyze/batch",
            "health":  "GET /health"
        }
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "layers": [
            "ELA", "Benford's Law",
            "Metadata Forensics",
            "NLP Semantic Analysis",
            "Graph Neural Network"
        ],
        "version": "2.0.0"
    }


@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Analyze a single document through all 5 layers.
    Returns full explainability report.
    """
    file_path = save_file(file)
    layers    = run_all_layers(file_path)
    report    = aggregate_results(file.filename, layers)

    return JSONResponse({
        "file_id": os.path.splitext(
                       os.path.basename(file_path))[0],
        "report":  report,
        "layers":  layers
    })


@app.post("/analyze/batch")
async def analyze_batch(files: List[UploadFile] = File(...), current_user: dict = Depends(get_current_user)):
    """
    Analyze multiple documents together.
    Activates GNN cross-document comparison.
    """
    if len(files) < 2:
        return JSONResponse(
            {"error": "Upload at least 2 documents for batch analysis"},
            status_code=400
        )

    saved_paths = [save_file(f) for f in files]

    # GNN runs across ALL documents together
    gnn_result = analyze_documents_gnn(saved_paths)

    per_doc = []
    for file, path in zip(files, saved_paths):
        layers = {
            "ela":      analyze_document_ela(path),
            "benfords": analyze_document_benfords(path),
            "metadata": analyze_document_metadata(path),
            "nlp":      analyze_document_nlp(path),
            "gnn":      gnn_result   # shared GNN result
        }
        report = aggregate_results(file.filename, layers)
        per_doc.append({
            "filename": file.filename,
            "report":   report,
            "layers":   layers
        })

    # Batch-level summary
    scores = [d["report"]["combined_risk_score"] for d in per_doc]
    avg    = round(sum(scores) / len(scores), 2)

    from app.utils.risk_aggregator import classify_risk
    risk = classify_risk(avg)

    return JSONResponse({
        "documents_analyzed":  len(files),
        "batch_risk_score":    avg,
        "batch_risk_level":    f"{risk['level']} {risk['emoji']}",
        "batch_action":        risk["action"],
        "gnn_cross_analysis":  gnn_result,
        "per_document":        per_doc
    })
@app.post("/network/analyze")
async def analyze_network(request: Request, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Analyze the network context of a document upload.
    Extracts request metadata and runs all 3 network sub-layers.
    """
    # Extract request metadata
    ip         = request.client.host
    user_agent = request.headers.get("user-agent", "")
    file_size  = 0

    # Save file temporarily to get size
    ext       = os.path.splitext(file.filename)[1]
    file_id   = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    file_size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 3)

    now = time.time()

    # Record this request in session store (for LSTM)
    record_request(ip, now, file_size_mb)

    # Build traffic feature vector
    request_meta = {
        "file_size_mb":         file_size_mb,
        "upload_duration_sec":  5.0,   # estimated; real value needs JS timing
        "files_in_session":     len([]),
        "request_interval_sec": 30.0,
        "hour_of_day":          datetime.now().hour,
    }

    # Run all 3 network sub-layers
    features          = extract_traffic_features(request_meta)
    isolation_result  = run_isolation_forest(features)
    lstm_result       = analyze_upload_sequence(ip)
    device_result     = analyze_device_fingerprint(user_agent, ip)

    # Aggregate
    network_report = aggregate_network_results(
        isolation_result, lstm_result, device_result
    )

    return JSONResponse({
        "file_id":        file_id,
        "filename":       file.filename,
        "file_size_mb":   file_size_mb,
        "request_info": {
            "ip":         ip,
            "user_agent": user_agent,
            "hour":       datetime.now().hour
        },
        "network_analysis": network_report,
        "components": {
            "isolation_forest": isolation_result,
            "lstm_sequence":    lstm_result,
            "device_fingerprint": device_result
        }
    })