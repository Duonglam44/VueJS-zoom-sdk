import { mapState } from 'vuex';

import RecorderAudio, { initRecordSerive } from '@/service/recordService';

export default {
  data() {
    return {
      localRecorder: null,
      remoteRecorder: null,
      loading: false,
      isRecording: false,
    };
  },

  computed: {
    ...mapState('twilio', ['device', 'connection']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
  },

  methods: {
    async startRecord() {
      if (!this.connection) return;

      try {
        this.isRecording = true;
        // get local stream and remote stream
        const localStream = this.connection.getLocalStream();
        const remoteStream = this.connection.getRemoteStream();
        // setup record
        this.localRecorder = new RecorderAudio(localStream);
        this.remoteRecorder = new RecorderAudio(remoteStream);
        await initRecordSerive();
        this.localRecorder.init();
        this.remoteRecorder.init();

        // start record
        this.localRecorder.start();
        this.remoteRecorder.start();
      } catch (error) {
        this.isRecording = false;
      }
    },

    stopAndClearRecord() {
      this.localRecorder.clear();
      this.remoteRecorder.clear();
      this.isRecording = false;
    },
    async sendRecordData() {
      if (!this.isRecording) return;

      try {
        this.loading = true;
        let localRecordBlob = '';
        let remoteRecordBlob = '';
        await this.localRecorder.stop().then(({ blob }) => {
          localRecordBlob = blob;
        });

        await this.remoteRecorder.stop().then(({ blob }) => {
          remoteRecordBlob = blob;
        });
        this.stopAndClearRecord();
        const fromData = new FormData();
        let customerNumber;

        if (customerNumber == null) {
          customerNumber = this.connection.parameters.From;
        }

        // send data to BE
        fromData.append('customer_record_blob', localRecordBlob);
        fromData.append('customer_number', customerNumber);
        // fromData.append("customer_transcript", JSON.stringify(customer_speech_result));
        // fromData.append("oeprator_transcript", JSON.stringify(operator_speech_result));
        fromData.append('oeprator_record_blob', remoteRecordBlob);
        fromData.append('memo', this.memo);
        fromData.append('time', `${this.min}:${this.sec}`);

        // TODO: send data of transcript and record file to BE
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.stopAndClearRecord();
      }
    },
  },
};
