import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error('VITE_API_URL is missing. Set in environment variables before building.');
}

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const api = {
  auth: {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => apiClient.post('/auth/reset-password', { token, newPassword })
  },
  transactions: {
    getAll: (params) => apiClient.get('/transactions', { params, ...getAuthConfig() }),
    get: (id) => apiClient.get(`/transactions/${id}`, getAuthConfig()),
    create: (data) => apiClient.post('/transactions', data, getAuthConfig()),
    update: (id, data) => apiClient.put(`/transactions/${id}`, data, getAuthConfig()),
    delete: (id) => apiClient.delete(`/transactions/${id}`, getAuthConfig())
  },
  categories: {
    getAll: () => apiClient.get('/categories', getAuthConfig()),
    create: (data) => apiClient.post('/categories', data, getAuthConfig()),
    seed: () => apiClient.post('/categories/seed', {}, getAuthConfig()),
    delete: (id) => apiClient.delete(`/categories/${id}`, getAuthConfig())
  },
  reports: {
    getSummary: (period) => apiClient.get(`/reports/summary?period=${period}`, getAuthConfig()),
    getSpending: (period) => apiClient.get(`/reports/spending?period=${period}`, getAuthConfig()),
    getTrend: (months) => apiClient.get(`/reports/trend?months=${months}`, getAuthConfig())
  },
  budgets: {
    getAll: () => apiClient.get('/budgets', getAuthConfig()),
    create: (data) => apiClient.post('/budgets', data, getAuthConfig()),
    update: (id, data) => apiClient.put(`/budgets/${id}`, data, getAuthConfig()),
    delete: (id) => apiClient.delete(`/budgets/${id}`, getAuthConfig())
  },
  profile: {
    get: () => apiClient.get('/profile', getAuthConfig()),
    update: (data) => apiClient.put('/profile', data, getAuthConfig())
  },
  notifications: {
    get: () => apiClient.get('/notifications', getAuthConfig()),
    update: (data) => apiClient.put('/notifications', data, getAuthConfig())
  }
};

export default api;