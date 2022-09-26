import { mapActions, mapState, mapGetters } from 'vuex';

import { RecorderAudio } from '@/service/recordAudio';
import { adjustSpeakerTime } from '@/shared/utils';
import InitRecordService from '@/service/InitRecordService';
import TwilioAPI from '@/service/TwilioService';

export default {
  data() {
    return {
      localRecorder: null,
      remoteRecorder: null,
      loading: false,
      isRecording: false,
      customerNumber: '',
    };
  },

  computed: {
    ...mapState('twilio', ['device', 'connection', 'holdingCallSid']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    ...mapGetters('twilio', ['remoteNumber']),
  },

  methods: {
    ...mapActions('phoneCall', ['saveDataPhoneCall']),

    async startRecordAndRecognize() {
      if (!this.connection) return;

      try {
        this.isRecording = true;

        this.customerNumber = this.remoteNumber;

        // get local stream and remote stream
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        await InitRecordService.initService();
        // setup record
        this.localStream = localStream;
        this.localRecorder = new RecorderAudio(localStream);
        const remoteStream = this.connection.getRemoteStream();
        this.remoteRecorder = new RecorderAudio(remoteStream);
        this.localRecorder.init();
        this.remoteRecorder.init();

        // start record
        this.localRecorder.start();
        this.remoteRecorder.start();

        // start recognize
        this.startSpeechRecognize();
      } catch (error) {
        this.isRecording = false;
        this.stopAndClearRecord();
        this.stopAndClearRecognize();
      }
    },

    stopAndClearRecord() {
      this.localRecorder?.clear();
      this.remoteRecorder?.clear();
      this.isRecording = false;
      this.localStream?.getTracks()?.forEach((track) => track.stop());
      this.localStream = null;
      this.localRecorder = null;
      this.remoteRecorder = null;
    },
    async sendRecordRecognizdData() {
      if (!this.isRecording && !this.isRecognizing) return;

      try {
        this.loading = true;
        let localRecordBlob = '';
        let remoteRecordBlob = '';
        await this.localRecorder?.stop?.()?.then(({ blob }) => {
          localRecordBlob = blob;
        });

        await this.remoteRecorder?.stop?.()?.then(({ blob }) => {
          remoteRecordBlob = blob;
        });
        this.stopAndClearRecord();
        this.stopAndClearRecognize();
        const { detail = {} } = await this.saveDataPhoneCall({
          remoteRecordBlob,
          customerNumber: this.customerNumber,
          localRecordBlob,
          memo: this.memo,
          time: adjustSpeakerTime({ min: this.min, sec: this.sec }),
        });

        if (this.holdingCallSid) {
          await TwilioAPI.updateOnHold({ phone_log_id: detail.phoneLogId });
        }

        this.loading = false;
      } catch (error) {
        console.log('sendRecordRecognizdData -> error', error);
        this.loading = false;
        this.stopAndClearRecognize();
        this.stopAndClearRecord();
      }
    },
  },
};
