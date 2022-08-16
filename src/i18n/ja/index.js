import common from './common';
import login from './login';
import resetPassword from './resetPassword';

export default {
  ...common,
  login,
  resetPassword,
  welcome: 'ようこそ',
};
