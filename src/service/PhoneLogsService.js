import axiosInstance from '@/service/axios';

const getPhoneLogs = (params) => {
  return axiosInstance.get('phone_logs', { params });
};

const getTodayPhoneLogs = (params) => {
  return axiosInstance.get('phone_logs/today', { params });
};

const phoneLogsService = {
  getPhoneLogs,
  getTodayPhoneLogs,
};

export default phoneLogsService;
