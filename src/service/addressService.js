import axiosInstance from '@/service/axios';

const create = (body) => {
  return axiosInstance.post('address', body);
};

const update = (phoneNumber, body) => {
  return axiosInstance.put(`address/${phoneNumber}`, body);
};

const addressService = {
  create,
  update,
};

export default addressService;
