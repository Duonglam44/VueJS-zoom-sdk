import axiosInstance from '@/service/axios';
import { CookiesStorage } from '@/shared/config/cookie';

export const loginPath = 'auth/login';

const getMe = () => {
  return axiosInstance.get('/auth/user-profile');
};

const login = (params) => {
  return axiosInstance.post(`/${loginPath}`, params);
};

const logout = () => {
  return axiosInstance.post('/auth/logout');
};

const refreshToken = () => {
  const token = CookiesStorage.getRefreshToken();
  return axiosInstance.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getTenants = () => {
  return axiosInstance.get('/tennants');
};

const authService = {
  login,
  logout,
  getMe,
  refreshToken,
  getTenants,
};

export default authService;
