<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ address.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ address.phoneNumber }}
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
import { mapMutations, mapState } from 'vuex';

import connectionMixins from '@/mixins/connection';
import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';

export default {
  name: 'AddressItem',

  mixins: [connectionMixins],

  props: { address: { type: Object, required: true } },

  computed: {
    ...mapState('twilio', ['device']),
    ...mapState('auth', ['user']),
  },

  methods: {
    ...mapMutations('twilio', ['setConnection']),

    callToAddress() {
      if (this.isInCalling) return;

      const params = {
        From: this.user.hasTennant.phoneNumber,
        To: this.address.phoneNumber,
        call_type: OUTGOING_CALL_TYPE.OUT_BOUND,
      };

      this.handleCall(params);
    },
  },
};
</script>
