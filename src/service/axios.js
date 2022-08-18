import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

import router from '@/router';
import { CookiesStorage } from '@/shared/config/cookie';
import { VUE_APP_API_URL } from '@/shared/config/setting';

const removeAccessToken = () => {
  CookiesStorage.clearAccessToken();
};

const handleErrorStatus = (data) => {
  const status = data?.status || data?.response?.status || null;
  switch (status) {
    case 401:
      // eslint-disable-next-line no-case-declarations
      const promiseData = new Promise((resolve) => {
        removeAccessToken();
        resolve('resolve');
      });
      promiseData.then(() => {
        router.push({ name: 'Login' });
      });
      return data;
    default:
      return data;
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
    if (token) {
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
    handleErrorStatus(error);
    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;
