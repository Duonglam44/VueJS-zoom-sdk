import axios from 'axios';
import router from '@/router';

const axiosInstance = axios.create({
  baseURL: '' /* TODO: CONFIG WHEN DEV SERVE AVAILABLE */,
});
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.status === 401) {
      // todo: remove auth data in vuex store
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
