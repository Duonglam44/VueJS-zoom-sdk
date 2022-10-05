import axiosInstance from '@/service/axios';

const getToken = () => {
  return axiosInstance.get('/phone_logs/getToken');
};

const createOnHold = (params) => {
  const { callSid = '', userId = '' } = params;

  return axiosInstance.get(`/phone_logs/on_hold/${callSid}/${userId}`);
};

const updateOnHold = (params) => {
  return axiosInstance.post(`/phone_logs/onhold`, params);
};

const twilioService = {
  getToken,
  createOnHold,
  updateOnHold,
};

export default twilioService;
