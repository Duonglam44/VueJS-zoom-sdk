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
        @click="callToAddress"
      >
        <v-icon left> mdi-phone</v-icon>
        {{ $t('phoneLogs.extension') }}
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'AddressItem',
  props: { address: { type: Object, required: true } },
  computed: {
    ...mapState('twilio', ['device']),
  },
  methods: {
    callToAddress() {
      this.device.connect();
    },
  },
};
</script>
