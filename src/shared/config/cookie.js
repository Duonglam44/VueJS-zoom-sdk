import Cookies from 'js-cookie';
import { getCurrentDomain, isElectron } from '../utils';
import { COOKIEKEY } from '../constant/common';

export const CookiesStorage = {
  setAccessToken(accessToken) {
    if (!isElectron()) {
      Cookies.set(COOKIEKEY.accessToken, accessToken, {
        domain: getCurrentDomain(),
        path: '/',
        expires: 1,
      });
    } else {
      window.electron.store.setAuth(accessToken);
    }
  },

  getAccessToken() {
    if (!isElectron()) return Cookies.get(COOKIEKEY.accessToken);
    return window.electron.store.getAuth();
  },

  clearAccessToken() {
    if (!isElectron()) {
      const domain = getCurrentDomain();
      Cookies.remove(COOKIEKEY.accessToken, { domain });
    } else {
      window.electron.store.removeToken();
    }
  },
};
