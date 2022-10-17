<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ address.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ phoneNumberFormated }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        style="min-height: 38px"
        color="success"
        class="white--text"
        :disabled="isInCalling"
        @click="callToAddress"
      >
        <v-icon left> mdi-phone</v-icon>
        {{ $t('phoneLogs.extension') }}
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';

import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';
import { formatNumber } from '@/shared/utils';

export default {
  name: 'AddressItem',

  props: { address: { type: Object, required: true } },

  computed: {
    ...mapState('twilio', ['device']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    ...mapGetters('twilio', ['isInCalling']),

    phoneNumberFormated() {
      return formatNumber(this.address.phoneNumber);
    },
  },

  methods: {
    ...mapActions('twilio', ['handleCall']),
    ...mapMutations('twilio', ['setConnection']),

    callToAddress() {
      if (this.isInCalling) return;

      const params = {
        From: this.currentUser.phoneNumber,
        To: this.address.phoneNumber,
        call_type: OUTGOING_CALL_TYPE.SEND_OUTBOUND_CALL,
      };

      this.handleCall(params);
    },
  },
};
</script>
