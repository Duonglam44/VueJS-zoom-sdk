<template>
  <div>
    <AppNavBar />
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import { isElectron } from '@/shared/utils';

import AppNavBar from '@/components/AppNavBar.vue';

export default {
  name: 'AuthLayout',

  components: {
    AppNavBar,
  },

  data() {
    return {
      removeAnswerListener: null,
      removeIgnoreListener: null,
    };
  },

  computed: {
    ...mapState('twilio', ['connection']),
    ...mapGetters('twilio', ['callType']),
  },

  created() {
    this.getPhraseList();
  },

  mounted() {
    if (isElectron()) {
      this.removeAnswerListener = window.electron.ipcRenderer.on(
        'answerCall',
        () => {
          this.acceptCall();
        }
      );
    }
  },

  beforeDestroy() {
    if (isElectron()) {
      this.removeAnswerListener?.();
    }
  },

  methods: {
    ...mapActions('twilio', ['acceptCall', 'callRejectHandler']),
    ...mapActions('phoneCall', ['getPhraseList']),
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
