<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-avatar color="#e9ecef" size="56" class="mt-5 mb-3 ml-3">
        <v-img v-if="user.profile_image" :src="user.profile_image"></v-img>
        <span v-else class="white--text headline">
          {{ user ? user.name : '' }}
        </span>
      </v-avatar>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ user.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ user.phone_number }}
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

export default {
  name: 'UserItem',
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
