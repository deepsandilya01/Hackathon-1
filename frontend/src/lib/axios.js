import axios from 'axios';
import { store } from '../app/app.store';
import { logout } from '../features/auth/state/auth.slice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't dispatch logout for /auth/login or /auth/get-me if we are just checking auth status
      if (error.config.url !== '/auth/login' && error.config.url !== '/auth/get-me') {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
