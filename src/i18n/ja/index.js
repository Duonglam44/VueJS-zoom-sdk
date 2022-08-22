import common from './common';
import login from './login';
import resetPassword from './resetPassword';
import phoneLogs from './phoneLogs';

export default {
  ...common,
  login,
  resetPassword,
  phoneLogs,
  welcome: 'ようこそ',
};
