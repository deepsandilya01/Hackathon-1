import axiosInstance from '../../../lib/axios';

export const reportIncident = (data) => {
  return axiosInstance.post('/incidents/report', data);
};

export const getMyIncidents = () => {
  return axiosInstance.get('/incidents/my-incidents');
};

export const getIncident = (id) => {
  return axiosInstance.get(`/incidents/${id}`);
};
