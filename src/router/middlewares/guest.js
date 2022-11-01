import authService from '@/service/authService';
import { CookiesStorage } from '@/shared/config/cookie';
import { verifyTennantUser } from '@/shared/utils';
import store from '@/store';

export const guestMiddleware = async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    try {
      const token = CookiesStorage.getAccessToken();
      const { user } = store.state.auth;

      if (!token) {
        // if don't have token, then redirect to login
        next('/login');
        return;
      }

      if (!user) {
        const res = await authService.getMe();
        if (res && verifyTennantUser(res)) {
          store.commit('auth/setUser', res);
          next();
          return;
        }

        store.commit('auth/setUser', null);
        next('/login');
      }

      next();
    } catch (error) {
      next('/login');
    }
  } else {
    next();
  }
};
