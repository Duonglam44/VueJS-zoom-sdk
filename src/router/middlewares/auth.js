import { CookiesStorage } from '@/shared/config/cookie';
import store from '@/store';

export const authMiddleware = (to, from, next) => {
  const token = CookiesStorage.getAccessToken();

  store.commit('auth/setAuthenticated', !!token);
  if (to.matched.some((record) => record.meta.guest)) {
    if (token) {
      next('/');
      return;
    }
    next();
  } else {
    next();
  }
};
