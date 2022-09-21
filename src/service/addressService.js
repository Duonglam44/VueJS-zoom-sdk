import axiosInstance from '@/service/axios';

const create = (body) => {
  return axiosInstance.post('address', body);
};

const addressService = {
  create,
};

export default addressService;
