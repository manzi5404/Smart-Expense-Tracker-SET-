import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Wallet, Sun, Moon, Menu, X, LayoutDashboard } from 'lucide-react'

function Navbar({ onOpenAuth }) {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              ExpenseTracker
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all shadow-md hover:shadow-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Sign In
                </button>

                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mt-2 p-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate('/dashboard')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenAuth('login')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('register')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar