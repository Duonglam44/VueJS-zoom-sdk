<template>
  <div>
    <AppNavBar />
    <router-view />
    <CallTypeModal />
    <IncomingCallDialog />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import { isElectron } from '@/shared/utils';

import AppNavBar from '@/components/AppNavBar.vue';
import CallTypeModal from '@/components/CallTypeModal.vue';
import IncomingCallDialog from '@/components/IncomingCallDialog.vue';

export default {
  name: 'AuthLayout',

  components: {
    AppNavBar,
    CallTypeModal,
    IncomingCallDialog,
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

      this.removeIgnoreListener = window.electron.ipcRenderer.on(
        'ignoreCall',
        () => {
          this.callRejectHandler();
        }
      );
    }
  },

  beforeDestroy() {
    if (isElectron()) {
      this.removeAnswerListener?.();
      this.removeIgnoreListener?.();
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
