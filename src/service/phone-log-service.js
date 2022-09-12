import axiosInstance from '@/service/axios';

function getAll(params) {
  return axiosInstance.get('phone_logs', { params });
}

function getAddress(params) {
  return axiosInstance.get('/address', { params });
}

function getUsers(params) {
  return axiosInstance.get('/users', { params });
}

const PhoneLogService = {
  getAll,
  getAddress,
  getUsers,
};

export default PhoneLogService;
