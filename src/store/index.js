import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import twilio from './modules/twilio';
import phoneLog from './modules/phoneLog';
import phoneCall from './modules/phoneCall';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    twilio,
    phoneLog,
    phoneCall,
  },
});
