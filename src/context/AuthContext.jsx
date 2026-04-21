import { api } from '../services/api'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()
const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    console.log('[AUTH] Initializing with token:', storedToken ? 'present' : 'none');
    if (storedToken) {
      setToken(storedToken);
      api.getProfile()
        .then(response => {
          console.log('[AUTH] Profile response:', response.data);
          const userData = response.data?.data || response.data || response;
          setUser(userData);
        })
        .catch((err) => {
          console.error('[AUTH] Profile fetch failed:', err.message);
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await api.login(email, password)
    console.log('[AUTH] Login response:', response.data);
    const payload = response.data?.data || response.data || response;
    const { user: userData, token: authToken } = payload;
    
    if (!authToken) {
      console.error('[AUTH] No token in login response:', payload);
      throw new Error('Login failed - no token received');
    }
    
    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(userData);
    
    return { user: userData, token: authToken };
  }, [])

  const register = useCallback(async (name, email, password) => {
    const response = await api.register(name, email, password)
    console.log('[AUTH] Register response:', response.data);
    const payload = response.data?.data || response.data || response;
    const { user: userData, token: authToken } = payload;
    
    if (!authToken) {
      console.error('[AUTH] No token in register response:', payload);
      throw new Error('Registration failed - no token received');
    }
    
    localStorage.setItem(TOKEN_KEY, authToken);
    setToken(authToken);
    setUser(userData);
    
    return { user: userData, token: authToken };
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    const response = await api.updateProfile(updates);
    const updatedUserData = response.data?.data || response.data || response;
    
    setUser(updatedUserData);
    return updatedUserData;
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

