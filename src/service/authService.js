import axiosInstance from '@/service/axios';
import { CookiesStorage } from '@/shared/config/cookie';

const getMe = () => {
  return axiosInstance.get('/auth/user-profile');
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

const authService = {
  logout,
  getMe,
  refreshToken,
};

export default authService;
