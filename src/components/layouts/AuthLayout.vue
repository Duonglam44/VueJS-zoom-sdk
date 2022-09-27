<template>
  <div>
    <AppNavBar />

    <v-container>
      <router-view />
    </v-container>
    <CallTypeModal />
  </div>
</template>

<script>
import AppNavBar from '@/components/AppNavBar.vue';
import CallTypeModal from '@/components/CallTypeModal.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { INCOMING_CALL_TYPE } from '@/shared/constant/common';

export default {
  name: 'AuthLayout',

  components: {
    AppNavBar,
    CallTypeModal,
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
    this.removeAnswerListener = window.electron.ipcRenderer.on(
      'answerCall',
      () => {
        this.handleAccept();
      }
    );

    this.removeIgnoreListener = window.electron.ipcRenderer.on(
      'ignoreCall',
      () => {
        this.rejectCall();
      }
    );
  },
  beforeDestroy() {
    this.removeAnswerListener();
    this.removeIgnoreListener();
  },

  methods: {
    ...mapActions('twilio', ['rejectCall']),
    ...mapMutations('twilio', ['setIsShowCallTypeModal']),

    handleAccept() {
      this.connection?.accept();
      this.connection?.on('accept', () => {
        if (this.callType === INCOMING_CALL_TYPE.SEND_OUTBOUND_CALL) {
          this.$router.push({ name: 'PhoneCallRoute' });

          return;
        }

        this.setIsShowCallTypeModal(true);
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
