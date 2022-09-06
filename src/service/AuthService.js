import axiosInstance from '@/service/axios';

const getMe = () => {
  return axiosInstance.get('/auth/user-profile');
};

export { getMe };
