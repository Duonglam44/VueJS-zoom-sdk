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
        @click="callToUser"
      >
        <v-icon left> mdi-phone</v-icon>
        {{ $t('phoneLogs.extension') }}
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import { mapState } from 'vuex';
import systemMixins from '@/mixins/system';

export default {
  name: 'UserItem',
  mixins: [systemMixins],
  props: { user: { type: Object, required: true } },
  computed: {
    ...mapState('twilio', ['device']),
  },
  methods: {
    callToUser() {
      this.device.connect();
    },
  },
};
</script>
