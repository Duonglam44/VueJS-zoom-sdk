import axiosInstance from '@/service/axios';

function TwilioService() {
  function getToken() {
    return axiosInstance.get('/phone_logs/getToken');
  }
  return {
    getToken,
  };
}

export default new TwilioService();
