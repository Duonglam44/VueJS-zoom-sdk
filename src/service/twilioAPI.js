import axiosInstance from '@/service/axios';

function TwilioAPI() {
  function getToken() {
    return axiosInstance.get('/phone_logs/getToken');
  }
  return {
    getToken,
  };
}

export default new TwilioAPI();
