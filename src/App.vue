<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

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
  created() {
    this.getPhraseList();
  },
  methods: {
    ...mapActions('phoneCall', ['getPhraseList']),
  },
};
</script>
