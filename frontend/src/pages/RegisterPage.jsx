import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Mail, Lock, Eye, EyeOff, Loader2, UserCheck, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isAdmin, setIsAdmin]               = useState(false)
  const [showPassword, setShowPassword]     = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await axios.post('/api/auth/register', { email, password, is_admin: isAdmin })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2200)
    } catch (err) {
      if (!err.response) setError('Cannot connect to server. Please try again.')
      else setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const perks = [
    'AI-powered resume analysis & scoring',
    'Personalised company matching engine',
    'Custom study plans & progress tracking',
    'Live mock interviews with AI feedback',
  ]

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left: Form Panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative" style={{ background: '#f8fafc' }}>
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '220px', height: '220px', background: 'rgba(59,130,246,0.05)', borderRadius: '9999px', pointerEvents: 'none' }} />

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e3a8a', fontFamily: "'Outfit', sans-serif" }}>Campus AI</span>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.875rem', color: '#0f172a', fontFamily: "'Outfit', sans-serif", lineHeight: 1.15 }}>
              Create your account ✨
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Start your placement preparation journey today — it's free.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', color: '#16a34a', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={16} /> Registration successful! Redirecting to login...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu" className="glass-input" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className="glass-input" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="glass-input" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>

            {/* Admin checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)' }}>
              <input type="checkbox" id="admin-check" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }} />
              <label htmlFor="admin-check" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                Register as Administrator <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>(for dashboard testing)</span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success} className="btn-brand" style={{ marginTop: '0.25rem', padding: '0.875rem', fontSize: '0.9375rem' }}>
              {loading
                ? <Loader2 size={17} className="animate-spin" />
                : <>Create Account <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Branding Panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)' }}
      >
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '360px', height: '360px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-60px', width: '420px', height: '420px', background: 'rgba(255,255,255,0.04)', borderRadius: '9999px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.125rem', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>Campus AI</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', marginTop: '2px' }}>Placement Strategist</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.15, fontFamily: "'Outfit', sans-serif", marginBottom: '1rem' }}>
            Everything you need to get placed.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            Join thousands of students who cracked placements using CampusAI's intelligent tools.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', flexShrink: 0, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={13} color="rgba(255,255,255,0.9)" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500 }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>© 2025 CampusAI • Built for placement success</p>
        </div>
      </div>
    </div>
  )
}
