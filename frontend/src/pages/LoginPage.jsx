import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, GraduationCap, BarChart3, BookOpen, Sparkles } from 'lucide-react'
import { AuthContext } from '../App'

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)
    try {
      const res = await axios.post('/api/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      login(res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: BarChart3,   title: 'Smart Company Matching',   desc: 'AI matches your CGPA & skills to top recruiters' },
    { icon: BookOpen,    title: 'Personalised Study Plans',  desc: 'Custom roadmaps tailored to your target companies' },
    { icon: Sparkles,    title: 'AI-Powered Mock Interviews',desc: 'Practice with real-time AI feedback and scoring' },
    { icon: GraduationCap, title: 'Resume Intelligence',    desc: 'ATS-optimised resume analysis and suggestions' },
  ]

  return (
    <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left Panel: Branding ───────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-12"
        style={{
          background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 75%, #3b82f6 100%)'
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '360px', height: '360px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '9999px',
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', left: '-60px',
          width: '480px', height: '480px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '9999px',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '10%',
          width: '180px', height: '180px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '9999px',
        }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div style={{
              width: '44px', height: '44px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.125rem', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>Campus AI</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', marginTop: '2px' }}>Placement Strategist</p>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10">
          <h1 style={{
            color: '#fff', fontWeight: 800, fontSize: '2.75rem',
            lineHeight: 1.1, fontFamily: "'Outfit', sans-serif",
            marginBottom: '1.25rem'
          }}>
            Land your<br />
            <span style={{ color: '#bfdbfe' }}>dream job</span><br />
            with AI.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '380px', marginBottom: '2.5rem' }}>
            CampusAI gives you an unfair advantage in campus placements — from resume analysis to mock interviews.
          </p>

          {/* Features list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{
                  width: '36px', height: '36px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color="rgba(255,255,255,0.9)" />
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1 }}>{title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', marginTop: '3px' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
            © 2025 CampusAI • Built for placement success
          </p>
        </div>
      </div>

      {/* ── Right Panel: Form ─────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative"
        style={{ background: '#f8fafc' }}
      >
        {/* Top right subtle bg shape */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '220px', height: '220px',
          background: 'rgba(59,130,246,0.06)',
          borderRadius: '9999px',
          pointerEvents: 'none',
        }} />

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e3a8a', fontFamily: "'Outfit', sans-serif" }}>Campus AI</span>
        </div>

        <div className="w-full max-w-md animate-slide-up">

          {/* Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.875rem', color: '#0f172a', fontFamily: "'Outfit', sans-serif", lineHeight: 1.15 }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Sign in to continue your placement journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '1.25rem', padding: '0.875rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="glass-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-brand" style={{ marginTop: '0.5rem', padding: '0.875rem', fontSize: '0.9375rem' }}>
              {loading
                ? <Loader2 size={17} className="animate-spin" />
                : <>Sign In <ArrowRight size={16} /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Register CTA */}
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
