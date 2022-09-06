import axiosInstance from '@/service/axios';

const getMe = () => {
  return axiosInstance.get('/auth/user-profile');
};

const logout = () => {
  return axiosInstance.post('/auth/logout');
};

const authService = {
  logout,
  getMe,
};

export default authService;
