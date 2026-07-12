import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on token expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  checkHealth: () => axios.get('http://localhost:5000/health'),
};

export const dataAPI = {
  upload: (formData) => api.post('/data/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const analyticsAPI = {
  getSummary: (state) => api.get('/analytics/summary', { params: { state } }),
  getMarketShare: (year) => api.get('/analytics/market-share', { params: { year } }),
  getCities: (state) => api.get('/analytics/cities', { params: { state } }),
  getGrowth: () => api.get('/analytics/growth'),
  getForecast: (state, city) => api.get('/analytics/forecast', { params: { state, city } }),
  analyzeSatellite: (imageData) => api.post('/analytics/analyze-satellite', imageData),
  checkMLHealth: () => axios.get('http://localhost:8000/'),
  restartML: () => api.post('/debug/restart-ml'),
  getSystemStats: () => api.get('/debug/stats'),
  getLogs: () => api.get('/debug/logs'),
};

export default api;
