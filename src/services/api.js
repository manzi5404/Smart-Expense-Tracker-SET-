const API_BASE = '/api'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

register: async (name, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password }) // Fixed: use 'password' not 'password_hash'
    })
    return handleResponse(response)
  },

  // Transactions
  getTransactions: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const url = `${API_BASE}/transactions${query ? `?${query}` : ''}`
    const response = await fetch(url, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  getTransaction: async (id) => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  addTransaction: async (data) => {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  updateTransaction: async (id, data) => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  deleteTransaction: async (id) => {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE}/categories`)
    return handleResponse(response)
  },

  // Reports
  getSummary: async (period = 'month') => {
    const response = await fetch(`${API_BASE}/reports/summary?period=${period}`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  getSpendingByCategory: async (period = 'month') => {
    const response = await fetch(`${API_BASE}/reports/spending?period=${period}`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  getMonthlyTrend: async (months = 6) => {
    const response = await fetch(`${API_BASE}/reports/trend?months=${months}`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  // Budgets
  getBudgets: async () => {
    const response = await fetch(`${API_BASE}/budgets`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  createBudget: async (data) => {
    const response = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/profile`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  // Notifications
  getNotificationSettings: async () => {
    const response = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  updateNotificationSettings: async (data) => {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  }
}

export default api
