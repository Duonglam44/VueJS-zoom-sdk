import router from '@/router';

import axiosInstance from '@/service/axios';
import { CookiesStorage } from '@/shared/config/cookie';
import authService from '@/service/AuthService';

const actionsAuth = {
  async login({ commit }, user) {
    commit('setLoading', true);
    try {
      const { accessToken, refreshToken } = await axiosInstance.post(
        'auth/login',
        user
      );
      CookiesStorage.setAccessToken(accessToken);
      CookiesStorage.setRefreshToken(refreshToken);
      router.push({ name: 'Home' });
      return Promise.resolve('success');
    } catch (error) {
      return Promise.reject(error.response);
    } finally {
      commit('setLoading', false);
    }
  },

  async logout({ commit, rootState }) {
    try {
      await authService.logout();

      rootState.twilio.device?.destroy?.();
      commit('twilio/setDevice', null, { root: true });
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
