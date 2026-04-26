import axios from 'axios';
import { store } from '../app/app.store';
import { logout } from '../features/auth/state/auth.slice';

export const API_BASE_URL = 'https://hackathon-1-2wnx.onrender.com/api';

export const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't dispatch logout for /auth/login or /auth/get-me if we are just checking auth status
      if (error.config.url !== '/auth/login' && error.config.url !== '/auth/get-me') {
        store.dispatch(logout());
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
