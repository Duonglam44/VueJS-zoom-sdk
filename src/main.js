import Vue from 'vue';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from 'vee-validate';
import { messages } from 'vee-validate/dist/locale/ja.json';
import { email, min, required } from 'vee-validate/dist/rules';
import i18n from './i18n';
import App from './App.vue';
import router from './router.js';
import vuetify from './plugins/vuetify';

extend('required', required);
extend('email', email);
extend('min', min);

localize('ja', { messages });

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

Vue.config.productionTip = false;
new Vue({
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
