import router from '@/router';

import { CookiesStorage } from '@/shared/config/cookie';
import authService from '@/service/authService';

const actionsAuth = {
  async login({ commit }, user) {
    commit('setLoading', true);
    try {
      const { accessToken, refreshToken } = await authService.login(user);
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

  async clearAuthData({ commit, rootState }) {
    await rootState.twilio.device?.unregister?.();

    commit('twilio/setDevice', null, { root: true });
    commit('setUser', null);

    CookiesStorage.clearAccessToken();
    router.push({ name: 'LoginRoute' });
  },

  async logout({ dispatch }) {
    try {
      await authService.logout();
      await dispatch('clearAuthData');

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default actionsAuth;
