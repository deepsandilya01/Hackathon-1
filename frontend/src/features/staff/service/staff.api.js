import axiosInstance from '../../../lib/axios';

export const getAllIncidents = (params) => {
  return axiosInstance.get('/incidents/all', { params });
};

export const updateIncidentStatus = (id, data) => {
  return axiosInstance.patch(`/incidents/${id}/status`, data);
};

export const getDashboardStats = () => {
  return axiosInstance.get('/incidents/dashboard');
};
