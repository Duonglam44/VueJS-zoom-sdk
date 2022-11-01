import authService from '@/service/authService';
import { CookiesStorage } from '@/shared/config/cookie';
import { verifyTennantUser } from '@/shared/utils';
import store from '@/store';

export const authMiddleware = async (to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    try {
      const token = CookiesStorage.getAccessToken();
      const { user } = store.state.auth;

      if (!token) {
        next();
        return;
      }

      if (!user) {
        const res = await authService.getMe();
        if (res && verifyTennantUser(res)) {
          store.commit('auth/setUser', res);
          next('/');
          return;
        }
        store.commit('auth/setUser', null);
        next();
      }

      next('/');
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};
