<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import axiosInstance from './service/axios';
import { CookiesStorage } from './shared/config/cookie';
import { formatApiURLByTennant } from './shared/utils';

export default {
  name: 'App',
  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapState('twilio', ['connection']),
  },
  watch: {
    isAuthenticated: {
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.$initTwilio();
        }
      },
      immediate: true,
    },
  },

  mounted() {
    window.electron.ipcRenderer.on('saveSetting', (newTennant) => {
      this.handleSaveSetting(newTennant);
    });
  },

  methods: {
    ...mapActions('auth', ['logout']),

    async handleSaveSetting(newTennant) {
      const oldTennant = CookiesStorage.getTennant();

      if (oldTennant !== newTennant) {
        if (this.isAuthenticated) await this.logout();
        axiosInstance.defaults.baseURL = formatApiURLByTennant(newTennant);
      }
      CookiesStorage.setTennant(newTennant);
    },
  },
};
</script>
