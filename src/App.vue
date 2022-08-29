<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState('auth', ['isAuthenticated']),
    ...mapState('connection', ['connection']),
  },
  watch: {
    isAuthenticated: {
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          // push to stash waiting for init device
          setTimeout(() => {
            if (this.$device) {
              this.$device.register();
            }
          });
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
