import { CookiesStorage } from '@/shared/config/cookie';

export const guestMiddleware = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = CookiesStorage.getAccessToken();
    if (token) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
};
