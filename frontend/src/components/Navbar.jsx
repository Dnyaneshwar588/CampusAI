import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sun, Moon, LogOut, ShieldAlert, User as UserIcon, Bell } from 'lucide-react'
import { AuthContext, ThemeContext } from '../App'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/') }

  const getHeaderTitle = () => {
    const path = location.pathname
    if (path.includes('/dashboard')) return 'Student Dashboard'
    if (path.includes('/profile'))   return 'Placement Profile'
    if (path.includes('/resume'))    return 'AI Resume Analyzer'
    if (path.includes('/companies')) return 'Company Matcher'
    if (path.includes('/planner'))   return 'Study Planner'
    if (path.includes('/interview')) return 'Mock Interview Console'
    if (path.includes('/chat'))      return 'AI Career Assistant'
    if (path.includes('/admin'))     return 'Admin Panel'
    return 'Placement Strategist'
  }

  const iconBtn = {
    padding: '0.4375rem',
    borderRadius: '0.625rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    color: '#64748b',
  }

  return (
    <header style={{
      display: 'flex',
      height: '64px',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f1f5f9',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      padding: '0 1.5rem 0 2rem',
      zIndex: 20,
      flexShrink: 0,
    }}>
      {/* Title */}
      <div>
        <h1 style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: '#0f172a',
          fontFamily: "'Outfit', sans-serif",
          background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}>
          {getHeaderTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={iconBtn}
          title="Toggle Theme"
          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Admin link */}
        {user?.is_admin && (
          <Link
            to={location.pathname === '/admin' ? '/dashboard' : '/admin'}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem', borderRadius: '0.625rem',
              background: 'rgba(99,102,241,0.08)',
              color: '#6366f1', fontSize: '0.75rem', fontWeight: 600,
              textDecoration: 'none', transition: 'background 0.15s',
              border: '1px solid rgba(99,102,241,0.15)',
            }}
          >
            <ShieldAlert size={13} />
            {location.pathname === '/admin' ? 'Student View' : 'Admin Console'}
          </Link>
        )}

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: '#e2e8f0', margin: '0 0.25rem' }} />

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="hidden md:block" style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', lineHeight: 1 }}>
              {user?.email.split('@')[0]}
            </p>
            <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '2px' }}>
              {user?.is_admin ? 'Administrator' : 'Student'}
            </p>
          </div>

          {/* Avatar */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8125rem' }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{ ...iconBtn, color: '#ef4444' }}
            title="Log Out"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  )
}
