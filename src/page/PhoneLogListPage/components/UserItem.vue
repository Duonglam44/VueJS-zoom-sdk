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
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';

import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';
import systemMixins from '@/mixins/system';

export default {
  name: 'UserItem',
  mixins: [systemMixins],
  props: { user: { type: Object, required: true } },
  computed: {
    ...mapState('twilio', ['device']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    ...mapGetters('twilio', ['isInCalling']),
  },
  methods: {
    ...mapActions('twilio', ['handleCall']),
    ...mapMutations('twilio', ['setConnection']),

    callToUser() {
      if (this.isInCalling) return;

      const params = {
        From: this.currentUser.phoneNumber,
        To: this.user.phoneNumber,
        call_type: OUTGOING_CALL_TYPE.IN_BOUND,
        user_id: this.user.userId,
      };

      this.handleCall(params);
    },
  },
};
</script>
