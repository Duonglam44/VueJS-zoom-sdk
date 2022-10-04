import axiosInstance from '@/service/axios';

const getPhoneLogs = (params) => {
  return axiosInstance.get('phone_logs', { params });
};

const getTodayPhoneLogs = (params) => {
  return axiosInstance.get('phone_logs/today', { params });
};

function getUsers(params) {
  return axiosInstance.get('users', { params });
}

const getPhoneLogDetail = (id) => {
  return axiosInstance.get(`phone_logs/${id}`);
};

const updateMemo = (id, data) => {
  return axiosInstance.post(`phone_logs/${id}/memo`, data);
};

const updateTagPhoneTalk = (data) => {
  return axiosInstance.post('phone_logs/phone_talk_log', data);
};

const phoneLogsService = {
  getPhoneLogs,
  getTodayPhoneLogs,
  getUsers,
  getPhoneLogDetail,
  updateMemo,
  updateTagPhoneTalk,
};

export default phoneLogsService;
