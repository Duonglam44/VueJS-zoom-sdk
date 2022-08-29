import axiosInstance from '@/service/axios';

function PhoneLogService() {
  function getAll(page) {
    return axiosInstance.get(`phone_logs?page=${page}`);
  }

  return {
    getAll,
  };
}

export default new PhoneLogService();
