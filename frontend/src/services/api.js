import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cyber_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user on session expiration
      localStorage.removeItem('cyber_token');
      localStorage.removeItem('cyber_user');
    }
    return Promise.reject(error);
  }
);

export default api;
