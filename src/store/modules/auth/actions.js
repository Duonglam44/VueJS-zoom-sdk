import router from '@/router';
import axiosInstance from '@/service/axios';
import { CookiesStorage } from '@/shared/config/cookie';

const actionsAuth = {
  login({ commit }, user) {
    commit('setLoading', true);
    axiosInstance
      .post('auth/login', user)
      .then((res) => {
        CookiesStorage.setAccessToken(res.accessToken);
        router.push({ name: 'Home' });
      })
      .catch((err) => {
        commit('setErrorLogin', err);
      })
      .finally(() => commit('setLoading', false));
  },
};

export default actionsAuth;
