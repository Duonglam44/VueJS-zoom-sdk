import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './en';
import ja from './ja';

Vue.use(VueI18n);

export default new VueI18n({
  locale: localStorage.getItem('lang') || 'ja',
  messages: {
    en,
    ja,
  },
});
