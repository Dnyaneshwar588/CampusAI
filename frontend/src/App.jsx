import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import ResumePage from './pages/ResumePage'
import CompaniesPage from './pages/CompaniesPage'
import StudyPlanPage from './pages/StudyPlanPage'
import InterviewPage from './pages/InterviewPage'
import ChatAssistant from './pages/ChatAssistant'
import AdminDashboard from './pages/AdminDashboard'

// Components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

// Contexts
export const AuthContext = createContext(null)
export const ThemeContext = createContext(null)

// Configure base API URL — uses VITE_API_BASE_URL on Render, empty string locally (Vite proxy)
axios.defaults.baseURL = (typeof __API_BASE__ !== 'undefined' && __API_BASE__) ? __API_BASE__ : 'http://127.0.0.1:8000'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')

  // Set Auth token headers globally
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('token', token)
      fetchUser()
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      setUser(null)
      setLoading(false)
    }
  }, [token])

  // Handle Dark/Light Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/auth/me')
      setUser(res.data)
    } catch (err) {
      console.error("Error fetching user session:", err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (newToken) => {
    setToken(newToken)
  }

  const logout = () => {
    setToken('')
    setUser(null)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, refreshUser: fetchUser }}>
      <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

            {/* Student Dashboard Paths */}
            <Route path="/*" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="resume" element={<ResumePage />} />
                    <Route path="companies" element={<CompaniesPage />} />
                    <Route path="planner" element={<StudyPlanPage />} />
                    <Route path="interview" element={<InterviewPage />} />
                    <Route path="chat" element={<ChatAssistant />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin Paths */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  )
}

function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext)
  
  return (
    <div style={{ position: 'relative', display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
      {/* Decorative glow spots */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'rgba(59,130,246,0.06)', borderRadius: '9999px', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '500px', height: '500px', background: 'rgba(99,102,241,0.04)', borderRadius: '9999px', filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* Sidebar */}
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', background: '#f8fafc' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
