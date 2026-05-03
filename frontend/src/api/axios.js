import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Backend offline atau network error
      console.error('Backend server tidak tersedia');
      error.message = 'Server tidak tersedia. Harap coba lagi nanti.';
    }
    return Promise.reject(error);
  }
);

export default api;
