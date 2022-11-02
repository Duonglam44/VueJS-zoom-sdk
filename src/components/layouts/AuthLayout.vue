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
    } else {
      window.addEventListener('beforeunload', this.preventNav);
    }
  },

  beforeDestroy() {
    if (isElectron()) {
      this.removeAnswerListener?.();
      this.removeIgnoreListener?.();
    } else {
      window.removeEventListener('beforeunload', this.preventNav);
    }
  },

  methods: {
    ...mapActions('twilio', ['acceptCall', 'callRejectHandler']),

    preventNav(event) {
      if (!this.connection) return;
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
