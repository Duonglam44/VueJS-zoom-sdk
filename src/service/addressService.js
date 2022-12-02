import axiosInstance from '@/service/axios';

const create = (body) => {
  return axiosInstance.post('address', body);
};

const update = (id, body) => {
  return axiosInstance.put(`address/${id}`, body);
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
