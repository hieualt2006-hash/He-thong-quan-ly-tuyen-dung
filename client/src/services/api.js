import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // If running on port 5173 (Vite dev mode), target port 5000 backend
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:5000/api';
  }
  // Otherwise use relative /api path (works on port 5000, localtunnel, cloud deployment)
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ats_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Request Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
