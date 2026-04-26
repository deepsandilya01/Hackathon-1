import axiosInstance from '../../../lib/axios';

export const login = (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const register = (data) => {
  return axiosInstance.post('/auth/register', data);
};

export const getMe = () => {
  return axiosInstance.get('/auth/get-me');
};

export const logoutUser = () => {
  return axiosInstance.post('/auth/logout');
};
