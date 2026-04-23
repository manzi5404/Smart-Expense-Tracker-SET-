import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error('VITE_API_URL is missing. Set in environment variables before building.');
}

const apiClient = axios.create({
  baseURL: API_BASE + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  response => {
    console.log('[✅ API SUCCESS]', response.config?.url, response.status);
    return response;
  },
  error => {
    console.error('[❌ API ERROR]', error.response?.status, error.response?.data?.message || error.message);
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API] No token found in localStorage');
    }

    // DEBUG: Log outgoing request config for reset-password endpoint
    if (config.url?.includes('/auth/reset-password')) {
      console.log('📤 [AXIOS DEBUG] Request config:');
      console.log('  URL:', config.url);
      console.log('  Method:', config.method);
      console.log('  Headers:', config.headers);
      console.log('  Data:', config.data);
    }

    return config;
  },
  error => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => apiClient.post('/auth/reset-password', { token, newPassword })
  },
  transactions: {
    getAll: (params) => apiClient.get('/transactions', { params }),
    get: (id) => apiClient.get(`/transactions/${id}`),
    create: (data) => apiClient.post('/transactions', data),
    update: (id, data) => apiClient.put(`/transactions/${id}`, data),
    delete: (id) => apiClient.delete(`/transactions/${id}`)
  },
  categories: {
    getAll: () => apiClient.get('/categories'),
    create: (data) => apiClient.post('/categories', data),
    seed: () => apiClient.post('/categories/seed', {}),
    delete: (id) => apiClient.delete(`/categories/${id}`)
  },
  reports: {
    getSummary: (period) => apiClient.get(`/reports/summary?period=${period}`),
    getSpending: (period) => apiClient.get(`/reports/spending?period=${period}`),
    getTrend: (months) => apiClient.get(`/reports/trend?months=${months}`)
  },
  budgets: {
    getAll: () => apiClient.get('/budgets'),
    create: (data) => apiClient.post('/budgets', data),
    update: (id, data) => apiClient.put(`/budgets/${id}`, data),
    delete: (id) => apiClient.delete(`/budgets/${id}`)
  },
  profile: {
    get: () => apiClient.get('/profile'),
    update: (data) => apiClient.put('/profile', data)
  },
  notifications: {
    get: () => apiClient.get('/notifications'),
    update: (data) => apiClient.put('/notifications', data)
  },

  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.put('/profile', data),
  getTransactions: (params) => apiClient.get('/transactions', { params }),
  getTransaction: (id) => apiClient.get(`/transactions/${id}`),
  addTransaction: (data) => apiClient.post('/transactions', data),
  updateTransaction: (id, data) => apiClient.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => apiClient.delete(`/transactions/${id}`),
  getCategories: () => apiClient.get('/categories'),
  createCategory: (data) => apiClient.post('/categories', data),
  seedCategories: () => apiClient.post('/categories/seed', {}),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`),
  getSummary: (period) => apiClient.get(`/reports/summary?period=${period}`),
  getSpendingByCategory: (period) => apiClient.get(`/reports/spending?period=${period}`),
  getMonthlyTrend: (months) => apiClient.get(`/reports/trend?months=${months}`),
  getBudgets: () => apiClient.get('/budgets'),
  createBudget: (data) => apiClient.post('/budgets', data),
  updateBudget: (id, data) => apiClient.put(`/budgets/${id}`, data),
  deleteBudget: (id) => apiClient.delete(`/budgets/${id}`),
  getNotificationSettings: () => apiClient.get('/notifications'),
  updateNotificationSettings: (data) => apiClient.put('/notifications', data)
};

export default api;