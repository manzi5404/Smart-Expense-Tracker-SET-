import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react'

function AuthModals({ isOpen, mode, onClose, onSwitchMode }) {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordRequirements = [
    { label: 'At least 8 characters', valid: registerData.password.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(registerData.password) },
    { label: 'Contains a letter', valid: /[a-zA-Z]/.test(registerData.password) },
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password)
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!passwordRequirements.every((r) => r.valid)) {
      setError('Password does not meet all requirements')
      return
    }

    setIsLoading(true)

    try {
      await register(registerData.name, registerData.email, registerData.password)
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForms = () => {
    setLoginData({ email: '', password: '' })
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForms()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'login' ? 'Sign In' : 'Create Account'}
      size="md"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="login-email"
                value={loginData.email}
                onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={loginData.password}
                onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isLoading}>
            Sign In
          </Button>

          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              onClick={onClose}
            >
              Forgot password?
            </Link>
          </div>

          <div className="text-center pt-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  resetForms()
                  onSwitchMode('register')
                }}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="register-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="register-name"
                value={registerData.name}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="register-email"
                value={registerData.email}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                value={registerData.password}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {registerData.password && (
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {req.valid ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-300" />
                    )}
                    <span className={req.valid ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-confirm-password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
            disabled={registerData.confirmPassword && registerData.password !== registerData.confirmPassword}
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  resetForms()
                  onSwitchMode('login')
                }}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default AuthModals