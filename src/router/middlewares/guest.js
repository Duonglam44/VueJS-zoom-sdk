import { getMe } from '@/service/AuthService';
import { CookiesStorage } from '@/shared/config/cookie';
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
        const res = await getMe();
        if (res) {
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
