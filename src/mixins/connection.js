import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';

export default {
  computed: {
    ...mapState('twilio', ['device']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    ...mapGetters('twilio', ['isInCalling']),
  },

  methods: {
    ...mapMutations('twilio', ['setIsShowCallTypeModal', 'setConnection']),

    ...mapActions('twilio', ['disconnectCall']),

    handleEndCall() {
      this.disconnectCall();
    },

    async handleCall(params) {
      const connection = await this.device?.connect({ params });
      connection
        .on('accept', () => {
          if (params.call_type === OUTGOING_CALL_TYPE.SEND_OUTBOUND_CALL) {
            this.setIsShowCallTypeModal(false);
            this.$router.push({ name: 'PhoneCallRoute' });

            return;
          }

          this.setIsShowCallTypeModal(true);
        })
        .on('ignore', this.handleEndCall)
        .on('hangup', this.handleEndCall)
        .on('disconnect', this.handleEndCall)
        .on('reject', this.handleEndCall);

      this.setConnection(connection);
    },
  },
};
