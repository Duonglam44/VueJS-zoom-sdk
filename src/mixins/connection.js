import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import { CALL_TYPE, OUTGOING_CALL_TYPE } from '@/shared/constant/common';

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

      if (this.callType !== CALL_TYPE.OUTBOUND_CALL) {
        this.$router.push({ name: 'PhoneLogListRoute' });
      }
    },

    async handleCall(params) {
      const connection = await this.device?.connect({ params });
      connection
        .on('accept', () => {
          if (params.call_type === OUTGOING_CALL_TYPE.OUT_BOUND) {
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
