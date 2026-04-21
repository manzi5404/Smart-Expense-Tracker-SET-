const API_BASE = '/api'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

// Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : { 'Content-Type': 'application/json' };
};


export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    return handleResponse(response)
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return handleResponse(response)
  },

resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
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
    const response = await fetch(`${API_BASE}/categories`, { headers: getAuthHeaders() })
    return handleResponse(response)
  },

  createCategory: async (data) => {
    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  seedCategories: async () => {
    const response = await fetch(`${API_BASE}/categories/seed`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
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

  updateBudget: async (id, data) => {
    const response = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  deleteBudget: async (id) => {
    const response = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}

export default api
