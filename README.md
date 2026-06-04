# TrustNet - AI-Powered Document Fraud Detection Platform

![TrustNet Logo](frontend/public/favicon.svg)

TrustNet is a production-grade SaaS platform that uses advanced AI and machine learning to detect document fraud, tampering, and manipulation. It combines multiple forensic analysis techniques including Error Level Analysis (ELA), Benford's Law analysis, NLP processing, and Graph Neural Networks to provide comprehensive document security.

## 🚀 Features

### Document Forensics
- **Error Level Analysis (ELA)** - Detects image compression artifacts and manipulation
- **Benford's Law Analysis** - Identifies statistical anomalies in numerical data
- **Metadata Forensics** - Extracts and analyzes document metadata
- **NLP Analysis** - Processes text for inconsistencies and patterns
- **Graph Neural Networks** - Cross-document relationship analysis

### Network Security
- **Device Fingerprinting** - Identifies and tracks devices
- **Traffic Analysis** - Monitors network patterns
- **LSTM Analysis** - Detects anomalous behavior sequences
- **Network Aggregation** - Combines multiple security signals

### User Experience
- **Professional Dashboard** - Real-time metrics and analytics
- **Intake Workspace** - Single and batch document scanning
- **Interactive Reports** - Detailed layer-by-layer breakdown
- **Historical Tracking** - Complete audit log of all scans

### Authentication & Security
- **Supabase Auth** - Secure authentication with OAuth providers
- **Email Verification** - Multi-factor authentication support
- **Password Recovery** - Secure password reset flow
- **Protected Routes** - Role-based access control

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization
- **Lucide Icons** - Beautiful icon set
- **Tailwind CSS** - Utility-first styling

### Backend
- **FastAPI** - High-performance Python framework
- **PyTorch** - Deep learning and ML models
- **NetworkX** - Graph analysis
- **NumPy/Pandas** - Data processing
- **Pillow** - Image processing

### Infrastructure
- **Supabase** - Authentication and database
- **REST API** - Standard HTTP endpoints

## 📸 Screenshots

### Landing Page
![Landing Page](frontend/src/assets/hero.png)

### Dashboard
*Professional dashboard with real-time metrics, risk trends, and scan history*

### Workspace
*Document upload interface with single and batch scanning capabilities*

### Analysis Report
*Detailed forensic analysis with layer breakdown and risk scoring*

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Supabase account (for authentication)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Configure your `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:
```bash
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable Email Auth in Authentication → Providers → Email
3. Configure OAuth providers (Google, GitHub, Microsoft, Apple) if needed
4. Copy your project URL and anon key to `.env`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `VITE_API_URL` | Backend API URL | Yes |

## 🎯 Usage

### For Development

1. Start the backend server on port 8000
2. Start the frontend dev server on port 5173
3. Open `http://localhost:5173` in your browser
4. Sign up for an account or use demo mode

### For Production

1. Build the frontend: `npm run build`
2. Deploy frontend to Vercel, Netlify, or similar
3. Deploy backend to a cloud provider (AWS, GCP, Azure)
4. Configure environment variables in your hosting platform
5. Set up proper CORS and security headers

## 📊 Features Overview

### Risk Scoring
- **0-30%**: Clean - No significant issues detected
- **30-60%**: Suspicious - Some anomalies found
- **60-100%**: High Risk - Strong indicators of fraud

### Analysis Layers
1. **ELA Analysis** - Image compression and manipulation detection
2. **Benford's Law** - Statistical distribution analysis
3. **Metadata Check** - Document metadata validation
4. **NLP Processing** - Text pattern recognition
5. **Network Analysis** - Cross-document relationships

### Subscription Tiers
- **Starter** - Basic scanning, 100 scans/month
- **Professional** - Full analysis suite, 1000 scans/month

## 🔒 Security

- All authentication handled by Supabase
- Environment variables never committed to git
- Protected routes require authentication
- Email verification for new users
- OAuth support for major providers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Supabase for authentication infrastructure
- Recharts for data visualization
- Lucide for beautiful icons
- The open-source community

## 📞 Support

For support, email support@trustnet.com or open an issue in the GitHub repository.

---

**Built with ❤️ by TrustNet Technologies Inc.**
