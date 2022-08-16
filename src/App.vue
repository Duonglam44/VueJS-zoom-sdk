<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { Device } from 'twilio-client';

export default {
  name: 'App',

  components: {},
  data: () => ({
    twilio_token: null,
    device: Device,
    twilio_connection: null,
    twilio_device: null,
    twilio_error: null,
    stream1: null,
    stream2: null,
  }),
  created() {
    this.setup();
  },
  methods: {
    setup() {
      fetch('https://matsushita-dev.unixon.co.jp/api/phone')
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          const result_json = JSON.parse(text);
          // 音声認識結果の表示
          if (result_json.status) {
            return result_json.data.twilio_token;
          }
          return '';
        })
        .then((token) => {
          this.twilio_token = token;
          this.device = new Device(this.twilio_token);
          console.log(token);
          // this.device.connect();
          this.device.setup(this.twilio_token, {
            region: 'jp1',
            closeProtection: 'ページを閉じると通話が切断されます。',
          });

          this.device.on('ready', (device) => {
            console.log('Twilio ready');
            this.twilio_device = device;
          });

          this.device.on('error', (error) => {
            console.log('Twilio error');
            this.twilio_error = error;
          });

          this.device.on('connect', (conn) => {
            this.twilio_connection = conn;
            // 発話ストリーム取得
            // オペレーター
            this.twilio_connection.mediaStream
              .getUserMedia({ video: false, audio: true })
              .then((stream) => {
                this.stream1 = stream;
                // createMedia(this.stream1)
              });
            // 客
            this.stream2 = new MediaStream([
              // eslint-disable-next-line no-underscore-dangle
              this.twilio_connection.mediaStream._remoteStream.getAudioTracks()[0],
            ]);
            // createMedia2(this.stream2)
          });

          this.device.on('disconnect', (conn) => {
            this.twilio_connection = conn;
            // 通話閉じる
            this.twilio_connection.disconnect();
          });

          this.device.on('offline', (device) => {
            this.twilio_device = device;
          });
          /**
           * 着信イベント
           */
          this.device.on('incoming', (conn) => {
            // conn is a Twilio.Connection object
            this.twilio_connection = conn;
          });
        });
    },
  },
};
</script>
