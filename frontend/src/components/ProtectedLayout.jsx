import React, { useState } from 'react'
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from './LoadingScreen'
import { 
  Shield, 
  LayoutDashboard, 
  FileSearch, 
  User, 
  Settings, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'

export default function ProtectedLayout() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // 1. Guard check
  if (loading) {
    return <LoadingScreen message="Verifying security credentials..." />
  }

  if (!user) {
    // Redirect to login page and keep tracked origin path
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (e) {
      console.error("Sign out error", e)
    }
  }

  // Sidebar Menu Items Config
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Intake Workspace', path: '/dashboard/workspace', icon: <FileSearch size={18} /> },
    { label: 'User Profile', path: '/dashboard/profile', icon: <User size={18} /> },
    { label: 'Account Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
    { label: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={18} />, badge: true },
    { label: 'Billing & Plan', path: '/dashboard/billing', icon: <CreditCard size={18} /> },
    { label: 'Help Desk', path: '/dashboard/help', icon: <HelpCircle size={18} /> }
  ]

  // Breadcrumbs Generator
  const pathnames = location.pathname.split('/').filter(x => x)
  const isDashboardRoot = pathnames.length === 1 && pathnames[0] === 'dashboard'

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#07090e' }}>
      
      {/* Desktop Sidebar (Left Panel) */}
      <aside className="sidebar desktop-only" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Branding header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
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
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Trust<span style={{ color: '#a855f7' }}>Net</span>
            </span>
            <div style={{ fontSize: 9, color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase', marginTop: -2 }}>
              Forensic Desk
            </div>
          </div>
        </div>

        {/* Navigation Sidebar List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1, marginTop: 10 }}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={idx} 
                to={item.path}
                className={`history-item ${isActive ? 'active' : ''}`}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? '#fff' : 'hsl(var(--text-secondary))',
                  background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: isActive ? '#818cf8' : 'hsl(var(--text-secondary))' }}>
                  {item.icon}
                </span>
                <span style={{ flexGrow: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: '#f43f5e',
                    boxShadow: '0 0 6px #f43f5e'
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User profile brief & Sign out button */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
              src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
              alt="Avatar" 
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.user_metadata?.full_name || user.email.split('@')[0]}
              </div>
              <div style={{ fontSize: 10, color: 'hsl(var(--text-muted))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="tab-button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px',
              border: '1px solid rgba(244, 63, 94, 0.15)',
              background: 'rgba(244, 63, 94, 0.02)',
              color: '#fda4af',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header Toolbar */}
      <header className="mobile-only glass-card" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 60,
        zIndex: 999,
        borderRadius: 0,
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent-gradient)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>TrustNet</span>
        </div>
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="mobile-only" style={{
          position: 'fixed',
          top: 60,
          left: 0,
          width: '100%',
          height: 'calc(100vh - 60px)',
          background: '#07090e',
          zIndex: 998,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path
              return (
                <Link 
                  key={idx} 
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: isActive ? '#fff' : 'hsl(var(--text-secondary))',
                    background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.15)' : '1px solid transparent'
                  }}
                >
                  {item.icon}
                  <span style={{ flexGrow: 1 }}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                alt="Avatar" 
                style={{ width: 36, height: 36, borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user.user_metadata?.full_name}</div>
                <div style={{ fontSize: 10, color: 'hsl(var(--text-muted))' }}>{user.email}</div>
              </div>
            </div>
            <button 
              onClick={() => { setMobileSidebarOpen(false); handleSignOut(); }}
              className="tab-button"
              style={{ width: '100%', border: '1px solid rgba(244, 63, 94, 0.15)', background: 'rgba(244, 63, 94, 0.02)', color: '#fda4af', padding: '10px' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Breadcrumb / Top Bar Header (Desktop only) */}
        <header className="desktop-only" style={{
          height: 70,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          background: 'rgba(7, 9, 14, 0.3)',
          backdropFilter: 'blur(8px)'
        }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'hsl(var(--text-secondary))', fontWeight: 600 }}>
            <Link to="/dashboard" style={{ color: 'hsl(var(--text-muted))', textDecoration: 'none' }}>TrustNet</Link>
            <ChevronRight size={12} style={{ color: 'hsl(var(--text-muted))' }} />
            {pathnames.map((path, idx) => {
              const routeTo = `/${pathnames.slice(0, idx + 1).join('/')}`
              const isLast = idx === pathnames.length - 1
              const title = path.charAt(0).toUpperCase() + path.slice(1)
              return isLast ? (
                <span key={idx} style={{ color: '#fff', fontWeight: 700 }}>{title}</span>
              ) : (
                <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Link to={routeTo} style={{ color: 'hsl(var(--text-muted))', textDecoration: 'none' }}>{title}</Link>
                  <ChevronRight size={12} style={{ color: 'hsl(var(--text-muted))' }} />
                </span>
              )
            })}
          </div>

          {/* User Quick Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/notifications" style={{ position: 'relative', color: 'hsl(var(--text-secondary))', textDecoration: 'none' }} title="Alert Center">
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#f43f5e',
                boxShadow: '0 0 6px #f43f5e'
              }} />
            </Link>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.05)', height: 20 }} />
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {user.user_metadata?.full_name || user.email.split('@')[0]}
              </span>
              <img 
                src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                alt="Avatar" 
                style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              />
            </Link>
          </div>
        </header>

        {/* Content Outlet scroll zone */}
        <main className="main-content-scroll" style={{
          flexGrow: 1,
          padding: '32px 40px',
          marginTop: 0,
          maxHeight: 'calc(100vh - 70px)',
          overflowY: 'auto',
          paddingTop: '32px'
        }}>
          {/* Mobile spacing padding */}
          <div className="mobile-only" style={{ height: 50 }} />
          <Outlet />
        </main>
      </div>

    </div>
  )
}
