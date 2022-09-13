<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-avatar color="#e9ecef" size="56">
        <span class="white--text headline">
          {{ user.name | avatar }}
        </span>
      </v-avatar>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ user.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ user.phoneNumber }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        style="min-height: 38px"
        color="success"
        class="white--text"
        :disabled="isInCalling"
        @click="callToUser"
      >
        <v-icon left> mdi-phone</v-icon>
        {{ $t('phoneLogs.extension') }}
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import { mapMutations, mapState } from 'vuex';

import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';
import systemMixins from '@/mixins/system';
import connectionMixins from '@/mixins/connection';

export default {
  name: 'UserItem',
  mixins: [systemMixins, connectionMixins],
  props: { user: { type: Object, required: true } },
  computed: {
    ...mapState('twilio', ['device']),
  },
  methods: {
    ...mapMutations('twilio', ['setConnection']),

    callToUser() {
      if (this.isInCalling) return;

      const { phoneNumber, tennantId } = this.currentUser.hasTennant;
      const callType =
        tennantId !== this.user.hasTennant.tennantId
          ? OUTGOING_CALL_TYPE.OUT_BOUND
          : OUTGOING_CALL_TYPE.IN_BOUND;
      const params = {
        From: phoneNumber,
        To: this.user.phoneNumber,
        call_type: callType,
        tennant: this.user.hasTennant.tennantId,
        user_id: this.user.userId,
      };

      this.handleCall(params);
    },
  },
};
</script>
