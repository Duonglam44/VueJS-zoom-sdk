import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

import router from '@/router';
import { CookiesStorage } from '@/shared/config/cookie';
import { VUE_APP_API_URL } from '@/shared/config/setting';
import authService from '@/service/AuthService';

const removeAccessToken = () => {
  CookiesStorage.clearAccessToken();
};

let refreshTokenRequest = null;

const handleErrorStatus = async (error) => {
  const status = error?.status || error?.response?.status || null;
  const refetchToken = CookiesStorage.getRefreshToken();
  switch (status) {
    case 401:
      if (error.config.isRetryRequest || !refetchToken) {
        const promiseData = new Promise((resolve) => {
          removeAccessToken();
          resolve('resolve');
        });
        promiseData.then(() => {
          router.push({ name: 'LoginRoute' });
        });
        refreshTokenRequest = null;

        return Promise.reject(error);
      }

      try {
        refreshTokenRequest = refreshTokenRequest || authService.refreshToken();
        const { accessToken, refreshToken } = await refreshTokenRequest;
        CookiesStorage.setAccessToken(accessToken);
        CookiesStorage.setRefreshToken(refreshToken);

        return axios({
          ...error.config,
          headers: {
            ...error.config?.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (_err) {
        const promiseData = new Promise((resolve) => {
          removeAccessToken();
          resolve('resolve');
        });
        promiseData.then(() => {
          router.push({ name: 'LoginRoute' });
        });

        return Promise.reject(error);
      } finally {
        // eslint-disable-next-line no-param-reassign
        error.config.isRetryRequest = true;
        refreshTokenRequest = null;
      }
    default:
      return Promise.reject(error);
  }
};

const axiosInstance = axios.create({
  baseURL: VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (req) => {
    const config = { ...req };
    const token = CookiesStorage.getAccessToken();
    if (config.params) {
      config.params = decamelizeKeys(config.params);
    }
    if (config.url === 'auth/login') return config;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => camelizeKeys(res.data),
  (error) => {
    return handleErrorStatus(error);
  }
);

export default axiosInstance;
