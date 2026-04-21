import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Insights from '../components/landing/Insights'
import Footer from '../components/landing/Footer'

function Landing() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 prevent-overflow">
      <Navbar isAuthenticated={isAuthenticated} />
      <main>
        <Hero isAuthenticated={isAuthenticated} />
        <Features />
        <HowItWorks />
        <Insights />
      </main>
      <Footer />
    </div>
  )
}

export default Landing