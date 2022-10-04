import axiosInstance from '@/service/axios';

const create = (body) => {
  return axiosInstance.post('address', body);
};

const update = (phoneNumber, body) => {
  return axiosInstance.put(`address/${phoneNumber}`, body);
};

const getAddress = (params) => {
  return axiosInstance.get('address', { params });
};

const addressService = {
  create,
  update,
  getAddress,
};

export default addressService;
