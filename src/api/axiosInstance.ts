import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — stub for future auth token injection
api.interceptors.request.use(
  (config) => {
    // TODO: inject auth token when auth is implemented
    // const token = localStorage.getItem('authToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — normalise errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: handle 401/403 globally (redirect to login)
    return Promise.reject(error);
  },
);
