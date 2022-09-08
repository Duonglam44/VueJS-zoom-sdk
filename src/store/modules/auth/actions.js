import router from '@/router';

import axiosInstance from '@/service/axios';
import { CookiesStorage } from '@/shared/config/cookie';
import authService from '@/service/AuthService';

const actionsAuth = {
  login({ commit }, user) {
    commit('setLoading', true);
    axiosInstance
      .post('auth/login', user)
      .then((res) => {
        CookiesStorage.setAccessToken(res.accessToken);
        CookiesStorage.setRefreshToken(res.refreshToken);
        router.push({ name: 'Home' });
      })
      .catch((err) => {
        commit('setErrorLogin', err.response.data);
      })
      .finally(() => commit('setLoading', false));
  },

  async logout({ commit }) {
    try {
      await authService.logout();

      commit('setUser', null);
      CookiesStorage.clearAccessToken();
      router.push({ name: 'LoginRoute' });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default actionsAuth;
