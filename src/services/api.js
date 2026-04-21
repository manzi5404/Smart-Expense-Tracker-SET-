import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error('VITE_API_URL is missing. Set in environment variables before building.');
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
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

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
};

export const transactionsApi = {
  getAll: (params) => api.get('/transactions', { params, ...getAuthConfig() }),
  get: (id) => api.get(`/transactions/${id}`, getAuthConfig()),
  create: (data) => api.post('/transactions', data, getAuthConfig()),
  update: (id, data) => api.put(`/transactions/${id}`, data, getAuthConfig()),
  delete: (id) => api.delete(`/transactions/${id}`, getAuthConfig())
};

export const categoriesApi = {
  getAll: () => api.get('/categories', getAuthConfig()),
  create: (data) => api.post('/categories', data, getAuthConfig()),
  seed: () => api.post('/categories/seed', {}, getAuthConfig()),
  delete: (id) => api.delete(`/categories/${id}`, getAuthConfig())
};

export const reportsApi = {
  getSummary: (period) => api.get(`/reports/summary?period=${period}`, getAuthConfig()),
  getSpending: (period) => api.get(`/reports/spending?period=${period}`, getAuthConfig()),
  getTrend: (months) => api.get(`/reports/trend?months=${months}`, getAuthConfig())
};

export const budgetsApi = {
  getAll: () => api.get('/budgets', getAuthConfig()),
  create: (data) => api.post('/budgets', data, getAuthConfig()),
  update: (id, data) => api.put(`/budgets/${id}`, data, getAuthConfig()),
  delete: (id) => api.delete(`/budgets/${id}`, getAuthConfig())
};

export const profileApi = {
  get: () => api.get('/profile', getAuthConfig()),
  update: (data) => api.put('/profile', data, getAuthConfig())
};

export const notificationsApi = {
  get: () => api.get('/notifications', getAuthConfig()),
  update: (data) => api.put('/notifications', data, getAuthConfig())
};

export const api = {
  auth: authApi,
  transactions: transactionsApi,
  categories: categoriesApi,
  reports: reportsApi,
  budgets: budgetsApi,
  profile: profileApi,
  notifications: notificationsApi,
  login: authApi.login,
  register: authApi.register,
  getTransactions: (params) => transactionsApi.getAll(params),
  getTransaction: (id) => transactionsApi.get(id),
  addTransaction: (data) => transactionsApi.create(data),
  updateTransaction: (id, data) => transactionsApi.update(id, data),
  deleteTransaction: (id) => transactionsApi.delete(id),
  getCategories: () => categoriesApi.getAll(),
  createCategory: (data) => categoriesApi.create(data),
  seedCategories: () => categoriesApi.seed(),
  deleteCategory: (id) => categoriesApi.delete(id),
  getSummary: (period) => reportsApi.getSummary(period),
  getSpendingByCategory: (period) => reportsApi.getSpending(period),
  getMonthlyTrend: (months) => reportsApi.getTrend(months),
  getBudgets: () => budgetsApi.getAll(),
  createBudget: (data) => budgetsApi.create(data),
  updateBudget: (id, data) => budgetsApi.update(id, data),
  deleteBudget: (id) => budgetsApi.delete(id),
  getProfile: () => profileApi.get(),
  updateProfile: (data) => profileApi.update(data),
  getNotificationSettings: () => notificationsApi.get(),
  updateNotificationSettings: (data) => notificationsApi.update(data)
};

export default api;