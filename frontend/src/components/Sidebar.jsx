import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  UserSquare2,
  FileText,
  Building2,
  BookOpen,
  MessageSquare,
  Bot,
  Sparkles
} from 'lucide-react'
import { AuthContext } from '../App'

export default function Sidebar() {
  const { user } = useContext(AuthContext)

  const navItems = [
    { name: 'Dashboard',       path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile',      path: '/profile',   icon: UserSquare2 },
    { name: 'Resume Analyzer', path: '/resume',    icon: FileText },
    { name: 'Company Matcher', path: '/companies', icon: Building2 },
    { name: 'Study Planner',   path: '/planner',   icon: BookOpen },
    { name: 'Mock Interview',  path: '/interview', icon: MessageSquare },
    { name: 'Career Assistant',path: '/chat',      icon: Bot },
  ]

  return (
    <aside style={{
      width: '250px',
      borderRight: '1px solid #e2e8f0',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      zIndex: 20,
      boxShadow: '2px 0 12px rgba(15,23,42,0.04)',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 1.5rem',
        borderBottom: '1px solid #f1f5f9',
        flexShrink: 0,
      }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
          flexShrink: 0,
        }}>
          <Sparkles size={15} color="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>Campus AI</p>
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px', fontWeight: 500 }}>Placement Strategist</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              borderRadius: '0.625rem',
              fontSize: '0.8125rem',
              fontWeight: isActive ? 600 : 500,
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: isActive ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'transparent',
              color: isActive ? '#1d4ed8' : '#64748b',
              borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = '#f8fafc'
                e.currentTarget.style.color = '#1e293b'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.querySelector('[data-active]')) {
                const isActive = e.currentTarget.style.borderLeft === '3px solid rgb(59, 130, 246)'
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#64748b'
                }
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }} />
                <span>{name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid #f1f5f9',
        background: '#fafbfd',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: '0.6875rem', fontWeight: 700 }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Logged in as</p>
            <p style={{ fontSize: '0.625rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
