import axiosInstance from '@/service/axios';

function TwilioService() {
  function getToken() {
    return axiosInstance.get('/phone_logs/getToken');
  }

  function createOnHold(params) {
    const { callSid = '', userId = '' } = params;

    return axiosInstance.get(`/phone_logs/on_hold/${callSid}/${userId}`);
  }

  function updateOnHold(params) {
    return axiosInstance.post(`/phone_logs/onhold`, params);
  }

  return {
    getToken,
    createOnHold,
    updateOnHold,
  };
}

export default new TwilioService();
