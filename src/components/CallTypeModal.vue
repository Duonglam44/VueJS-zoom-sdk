<template>
  <v-dialog v-model="isShow" max-width="350" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-actions class="d-flex justify-center mb-2">
        <v-btn v-if="showTransferButton" color="primary" @click="transferCall">
          <v-icon right dark> mdi-phone </v-icon>
          {{ $t('callTypeModal.replyTransfer') }}
        </v-btn>

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
import {
  INCOMING_CALL_TYPE,
  OUTGOING_CALL_TYPE,
} from '@/shared/constant/common';

export default {
  name: 'CallTypeModal',

  data() {
    return { INCOMING_CALL_TYPE };
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
        if (this.callType === INCOMING_CALL_TYPE.ONHOLD_INBOUND) {
          return this.$t('callTypeModal.title.transferCall');
        }

        return this.$t('callTypeModal.title.inboundCall');
      }

      if (this.connection?.direction === 'OUTGOING') {
        if (this.callType === OUTGOING_CALL_TYPE.IN_BOUND) {
          return this.$t('callTypeModal.title.inboundCall');
        }

        return this.$t('callTypeModal.title.transferCall');
      }

      return this.connection?.direction;
    },

    showTransferButton() {
      return this.connection?.direction === 'INCOMING';
    },
  },

  beforeDestroy() {
    this.disconnectCall();
  },

  methods: {
    ...mapActions('twilio', {
      transferCall: 'returnCall',
      disconnectCall: 'disconnectCall',
    }),
    ...mapMutations('twilio', ['setIsShowCallTypeModal', 'setConnection']),

    handleCannel() {
      this.disconnectCall();
    },
  },
};
</script>
