<template>
  <v-dialog v-model="isShow" max-width="350" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-actions class="d-flex justify-center mb-2">
        <template v-if="status && status !== 'open'">
          <v-btn color="success" @click="handleAccept">
            <v-icon right dark> mdi-phone </v-icon>
            {{ $t('callTypeModal.reply') }}
          </v-btn>

          <v-btn
            v-if="callType === CALL_TYPE.ONHOLD_INBOUND"
            color="primary"
            @click="handleTransfer"
          >
            <v-icon right dark> mdi-phone </v-icon>
            {{ $t('callTypeModal.replyTransfer') }}
          </v-btn>
        </template>

        <v-btn color="error" @click="handleCannel">
          <v-icon dark right> mdi-cancel </v-icon>
          {{ $t('callTypeModal.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { CALL_TYPE } from '@/shared/constant/common';

export default {
  name: 'CallTypeModal',

  data() {
    return { CALL_TYPE };
  },

  computed: {
    ...mapState('twilio', ['isShowCallTypeModal', 'connection']),
    ...mapGetters('twilio', ['callType']),

    isShow: {
      get() {
        return this.isShowCallTypeModal;
      },

      set(value) {
        this.setIsShowCallTypeModal(value);
      },
    },

    status() {
      return this.connection?.status();
    },

    title() {
      if (this.status === 'pending') {
        return this.$t('callTypeModal.title.pendingCall');
      }

      if (this.connection?.direction === 'INCOMING') {
        if (this.callType === CALL_TYPE.ONHOLD_INBOUND) {
          return this.$t('callTypeModal.title.transferCall');
        }

        return this.$t('callTypeModal.title.inboundCall');
      }

      if (this.connection?.direction === 'OUTGOING') {
        return 'OUTGOING';
      }

      return this.connection?.direction;
    },
  },

  beforeDestroy() {
    this.disconnectCall();
  },

  methods: {
    ...mapActions('twilio', ['disconnectCall', 'rejectCall']),
    ...mapMutations('twilio', ['setIsShowCallTypeModal', 'setConnection']),

    handleAccept() {
      this.connection?.accept();

      if (this.callType === CALL_TYPE.OUTBOUND_CALL) {
        this.$router.push({ name: 'PhoneCallRoute' });
        this.setIsShowCallTypeModal(false);
      }
    },

    handleTransfer() {
      this.setIsShowCallTypeModal(false);
    },

    handleCannel() {
      if (this.status === 'open') {
        this.disconnectCall();
      } else {
        this.rejectCall();
      }

      this.closeCall();
    },

    closeCall() {
      this.setIsShowCallTypeModal(false);
      this.setConnection(null);
    },
  },
};
</script>
