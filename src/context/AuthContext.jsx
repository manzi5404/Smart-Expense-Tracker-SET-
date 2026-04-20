import { api } from '../services/api'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()
const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedToken) {
      setToken(storedToken)
      // Decode token to get user ID (optional, full user from profile)
      try {
        // Could verify token here if needed
        setIsLoading(false)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
      }
    }
    setIsLoading(false)
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

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
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

