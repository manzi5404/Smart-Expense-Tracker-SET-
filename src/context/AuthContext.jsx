import { api } from '../services/api'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()
const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedToken) {
      setToken(storedToken)
      api.getProfile()
        .then(response => {
          const userData = response.data || response
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await api.login(email, password)
    const { user: userData, token: authToken } = response.data || response
    
    localStorage.setItem(TOKEN_KEY, authToken)
    setToken(authToken)
    setUser(userData)
    
    return { user: userData, token: authToken }
  }, [])

  const register = useCallback(async (name, email, password) => {
    const response = await api.register(name, email, password)
    const { user: userData, token: authToken } = response.data || response
    
    localStorage.setItem(TOKEN_KEY, authToken)
    setToken(authToken)
    setUser(userData)
    
    return { user: userData, token: authToken }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    const response = await api.updateProfile(updates)
    const updatedUserData = response.data || response
    
    setUser(updatedUserData)
    return updatedUserData
  }, [])

  // Provide navigate function for components that need it
  const logoutAndNavigate = useCallback((navigateFn) => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    if (navigateFn) {
      navigateFn('/')
    }
  }, [])

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    logoutAndNavigate,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

