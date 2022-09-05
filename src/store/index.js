import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import twilio from './modules/twilio';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    twilio,
  },
});
