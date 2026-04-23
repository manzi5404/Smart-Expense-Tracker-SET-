import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'

function MainLayout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 prevent-overflow">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout