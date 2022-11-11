import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { isNil } from 'lodash';

import router from '@/router';
import store from '@/store';
import { CookiesStorage } from '@/shared/config/cookie';
import {
  formatApiURLByTennant,
  getCurrentTennant,
  stringifyParams,
} from '@/shared/utils';
import { RESPONSE_TYPE_TRANSFORM, HTTP_STATUS } from '@/shared/constant/common';

import authService, { loginPath } from '@/service/authService';

const removeAccessToken = () => {
  CookiesStorage.clearAccessToken();
};

let refreshTokenRequest = null;
let isRetryRequest = false;

const handleErrorStatus = async (error) => {
  const status = error?.status || error?.response?.status || null;
  const refetchToken = CookiesStorage.getRefreshToken();
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
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
    case HTTP_STATUS.FORBIDDEN: {
      const { url } = error.config ?? {};

      if (url !== loginPath) {
        await store.dispatch('auth/clearAuthData');
      }

      return Promise.reject(error);
    }
    default:
      return Promise.reject(error);
  }
};

const axiosInstance = axios.create({
  baseURL: formatApiURLByTennant(getCurrentTennant()),
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
    if (config.url === loginPath) return config;
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
  (res) => {
    if (RESPONSE_TYPE_TRANSFORM.includes(res.config.responseType)) {
      return res;
    }

    return camelizeKeys(res.data);
  },
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
