import axiosInstance from '../../../lib/axios';

export const getNotifications = () => {
  return axiosInstance.get('/notifications');
};

export const markAsRead = (id) => {
  return axiosInstance.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return axiosInstance.patch('/notifications/read-all');
};
