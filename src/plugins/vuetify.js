import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import TelephoneInbound from '@/assets/icons/telephone-inbound';
import CopyrightIcon from '../assets/icons/copyright.vue';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      copyright: {
        component: CopyrightIcon,
      },
      telephoneInbound: {
        component: TelephoneInbound,
      },
    },
  },
});
