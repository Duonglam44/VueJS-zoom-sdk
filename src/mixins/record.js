import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';

import { RecorderAudio } from '@/service/recordAudio';
import { adjustSpeakerTime } from '@/shared/utils';
import InitRecordService from '@/service/InitRecordService';
import twilioService from '@/service/twilioService';

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
    ...mapMutations('twilio', ['setHoldingCallSid']),

    async startRecordAndRecognize() {
      if (!this.connection) return;

      try {
        this.isRecording = true;

        this.customerNumber = this.remoteNumber;

        // get local stream and remote stream
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        await InitRecordService.initService();
        // setup record
        this.localRecorder = new RecorderAudio(this.localStream);
        this.remoteStream = new MediaStream([
          this.connection.getRemoteStream().getAudioTracks()[0],
        ]);
        this.remoteRecorder = new RecorderAudio(this.remoteStream);
        this.remoteRecorder.init();
        this.localRecorder.init();

        // start record
        this.localRecorder.start();
        this.remoteRecorder.start();

        // start recognize
        this.startSpeechRecognize();
      } catch (error) {
        console.log('startRecordAndRecognize -> error', error);
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
      this.remoteStream?.getTracks()?.forEach((track) => track.stop());
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
        const { data = {} } = await this.saveDataPhoneCall({
          remoteRecordBlob,
          customerNumber: this.customerNumber,
          localRecordBlob,
          memo: this.memo,
          time: adjustSpeakerTime({ min: this.min, sec: this.sec }),
        });

        if (this.holdingCallSid) {
          await twilioService.updateOnHold({ phone_log_id: data.phoneLogId });
          this.setHoldingCallSid('');
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
