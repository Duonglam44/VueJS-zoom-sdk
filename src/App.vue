<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import twilioService from '@/service/twilio-service';
import { Device } from '@twilio/voice-sdk';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      device: undefined,
    };
  },
  created() {
    this.initTwilio();
  },
  methods: {
    async initTwilio() {
      try {
        const token = await twilioService.getToken();
        const device = new Device(token);
        device
          .on(Device.EventName.Registered, this.onRegistered)
          .on(Device.EventName.Connect, this.onConnect)
          .on(Device.EventName.Incoming, this.onIncoming);
      } catch (e) {
        // todo: handle error
      }
    },
    onRegistered() {},
    onConnect() {},
    onIncoming() {},
  },
};
</script>
