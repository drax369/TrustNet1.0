import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Menu, X, Check } from 'lucide-react'

export default function PublicLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#07090e',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.04) 0px, transparent 50%), radial-gradient(at 50% 0%, rgba(168, 85, 247, 0.02) 0px, transparent 50%)',
      color: 'hsl(var(--text-primary))',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Dynamic Header / Navbar */}
      <header className="glass-card" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        background: 'rgba(7, 9, 14, 0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--accent-gradient)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.25)'
            }}>
              <Shield size={16} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Trust<span style={{ color: '#a855f7' }}>Net</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <Link to="/features" style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none', transition: 'color 0.2s' }}>Features</Link>
            <Link to="/pricing" style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</Link>
            <Link to="/about" style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none', transition: 'color 0.2s' }}>About</Link>
            <Link to="/docs" style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none', transition: 'color 0.2s' }}>Docs</Link>
            <Link to="/contact" style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none', transition: 'color 0.2s' }}>Contact</Link>
          </nav>

          {/* Action CTA */}
          <div className="desktop-only" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="tab-button active"
                style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13 }}
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '8px 16px' }}>Sign In</Link>
                <button 
                  onClick={() => navigate('/register')}
                  className="tab-button active"
                  style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13 }}
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button 
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-only" style={{
            position: 'absolute',
            top: 70,
            left: 0,
            width: '100%',
            background: '#07090e',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 24px',
            gap: 16,
            zIndex: 999
          }}>
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>Features</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>Pricing</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>About</Link>
            <Link to="/docs" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>Docs</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-secondary))', textDecoration: 'none' }}>Contact</Link>
            <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
            {user ? (
              <button 
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="tab-button active"
                style={{ width: '100%', padding: '10px' }}
              >
                Go to Dashboard
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '10px' }}>Sign In</Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                  className="tab-button active"
                  style={{ width: '100%', padding: '10px' }}
                >
                  Start Free Trial
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer style={{
        backgroundColor: '#05070a',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '64px 24px 32px',
        color: 'hsl(var(--text-secondary))',
        fontSize: 13
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            marginBottom: 48
          }}>
            {/* Branding Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 28, height: 28,
                  background: 'var(--accent-gradient)',
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Shield size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  Trust<span style={{ color: '#a855f7' }}>Net</span>
                </span>
              </div>
              <p style={{ lineHeight: 1.6, color: 'hsl(var(--text-muted))', marginBottom: 16 }}>
                Production-grade, AI-powered digital forensics scanning client logs and pixel patterns to combat financial fraud.
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Product</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><Link to="/features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</Link></li>
                <li><Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing Plans</Link></li>
                <li><Link to="/docs" style={{ color: 'inherit', textDecoration: 'none' }}>Developer API</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
                <li><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact &amp; Support</Link></li>
                <li><Link to="/docs" style={{ color: 'inherit', textDecoration: 'none' }}>Compliance Documentation</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Legal</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Legal bottom row */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            color: 'hsl(var(--text-muted))'
          }}>
            <span>&copy; {new Date().getFullYear()} TrustNet Technologies Inc. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
