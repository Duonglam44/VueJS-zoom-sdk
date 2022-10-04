import common from './common';
import login from './login';
import resetPassword from './resetPassword';
import phoneLogs from './phoneLogs';
import phoneCall from './phoneCall';
import addressModal from './addressModal';

export default {
  ...common,
  login,
  resetPassword,
  phoneLogs,
  phoneCall,
  addressModal,
  welcome: 'Welcome!',
};
