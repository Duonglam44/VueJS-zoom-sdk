import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { isNil } from 'lodash';

import router from '@/router';
import { CookiesStorage } from '@/shared/config/cookie';
import { VUE_APP_API_URL } from '@/shared/config/setting';
import authService from '@/service/authService';
import { stringifyParams } from '@/shared/utils';

const removeAccessToken = () => {
  CookiesStorage.clearAccessToken();
};

let refreshTokenRequest = null;
let isRetryRequest = false;

const handleErrorStatus = async (error) => {
  const status = error?.status || error?.response?.status || null;
  const refetchToken = CookiesStorage.getRefreshToken();
  switch (status) {
    case 401:
      if (isRetryRequest || !refetchToken) {
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
        isRetryRequest = true;
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
        isRetryRequest = false;
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
    if (config.headers['Content-Type'] === 'multipart/form-data') return config;

    if (config.data) {
      config.data = decamelizeKeys(config.data);
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

axiosInstance.defaults.paramsSerializer = (params) =>
  stringifyParams({
    params: decamelizeKeys({ ...params }),
    option: {
      encode: !isNil(params?.tags) || false,
    },
  });

export default axiosInstance;
