import axiosInstance from '@/service/axios';

const getAll = (params) => {
  return axiosInstance.get('phone_logs', { params });
};

const phoneLogsService = {
  getAll,
};

export default phoneLogsService;
