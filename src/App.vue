<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

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
    window.electron.ipcRenderer.on('navigate', (routePath) => {
      this.$router.push({ name: routePath });
    });

    window.electron.ipcRenderer.on('answerCall', () => {
      this.connection.accept();
    });
  },
};
</script>
