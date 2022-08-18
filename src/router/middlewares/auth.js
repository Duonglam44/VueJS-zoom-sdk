import { CookiesStorage } from '@/shared/config/cookie';

export const authMiddleware = (to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    const token = CookiesStorage.getAccessToken();
    if (token) {
      next('/');
      return;
    }
    next();
  } else {
    next();
  }
};
