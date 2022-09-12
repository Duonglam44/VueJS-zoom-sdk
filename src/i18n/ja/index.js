import common from './common';
import login from './login';
import resetPassword from './resetPassword';
import phoneLogs from './phoneLogs';
import phoneCall from './phoneCall';

export default {
  ...common,
  login,
  resetPassword,
  phoneLogs,
  phoneCall,
  welcome: 'ようこそ',
};
