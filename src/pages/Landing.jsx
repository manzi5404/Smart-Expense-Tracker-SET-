import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Insights from '../components/landing/Insights'
import Footer from '../components/landing/Footer'
import AuthModals from '../components/landing/AuthModals'

function Landing() {
  const { isAuthenticated, isLoading } = useAuth()
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })

  // Redirect authenticated users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleOpenAuth = (mode) => {
    setAuthModal({ isOpen: true, mode })
  }

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' })
  }

  const handleSwitchMode = (mode) => {
    setAuthModal({ isOpen: true, mode })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main>
        <Hero onOpenAuth={handleOpenAuth} />
        <Features />
        <HowItWorks />
        <Insights />
      </main>
      <Footer />

      <AuthModals
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={handleCloseAuth}
        onSwitchMode={handleSwitchMode}
      />
    </div>
  )
}

export default Landing