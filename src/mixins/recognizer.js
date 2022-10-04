import {
  SpeechRecognizer,
  AudioConfig,
  SpeechConfig,
  ResultReason,
} from 'microsoft-cognitiveservices-speech-sdk';
import { mapMutations } from 'vuex';

import { VUE_APP_AZURE_SUBSCRIPTION } from '@/shared/config/setting';
import {
  REGION_OPTIONS,
  SPEECH_RECOGNITION_LANGUAGE,
} from '@/shared/constant/common';
import { adjustSpeakerTime } from '@/shared/utils';

export default {
  data() {
    return {
      recognizerRemote: null,
      recognizerLocal: null,
      isRecognizing: false,
    };
  },

  methods: {
    ...mapMutations('phoneCall', ['receiveSpeechRecognized']),

    async startSpeechRecognize() {
      if (!this.connection) return;

      try {
        // get local stream (operator)
        const localStream = this.connection.getLocalStream();

        // get remote stream (customer)
        const remoteStream = this.connection.getRemoteStream();
        const {
          hasTennant: { azureSttSubscription },
          name,
        } = this.currentUser;
        const speechConfig = SpeechConfig.fromSubscription(
          azureSttSubscription || VUE_APP_AZURE_SUBSCRIPTION,
          REGION_OPTIONS
        );

        speechConfig.speechRecognitionLanguage = SPEECH_RECOGNITION_LANGUAGE;
        // config stream input for local stream
        const audioConfigLocal = AudioConfig.fromStreamInput(localStream);
        this.recognizerLocal = new SpeechRecognizer(
          speechConfig,
          audioConfigLocal
        );

        const customerName =
          this.connection?.direction === 'INCOMING'
            ? this.connection.customParameters.get('From')
            : this.connection.customParameters.get('To');

        this.recognizerLocal.startContinuousRecognitionAsync();
        let startTimeLocal = null;
        let endTimeLocal = null;

        // listen recognize data from local stream
        this.recognizerLocal.recognizing = (_, event) => {
          if (event.result.reason === ResultReason.RecognizingSpeech) {
            if (startTimeLocal === null) {
              startTimeLocal = adjustSpeakerTime({
                min: this.min,
                sec: this.sec,
                adjust: -3,
              });
            }
          }
        };

        this.recognizerLocal.recognized = (_, event) => {
          if (event.result.reason === ResultReason.RecognizedSpeech) {
            const { text } = event.result;
            if (text) {
              endTimeLocal = adjustSpeakerTime({
                min: this.min,
                sec: this.sec,
              });
              this.receiveSpeechRecognized({
                name,
                start_time: startTimeLocal,
                end_time: endTimeLocal,
                text,
                meta: null,
                operator: true,
              });
            }
            startTimeLocal = null;
            endTimeLocal = null;
          }
        };

        // config stream input for remote stream
        const audioConfigRemote = AudioConfig.fromStreamInput(remoteStream);
        this.recognizerRemote = new SpeechRecognizer(
          speechConfig,
          audioConfigRemote
        );
        this.recognizerRemote.startContinuousRecognitionAsync();
        let startTimeRemote = null;
        let endTimeRemote = null;

        this.recognizerRemote.recognizing = (_, event) => {
          if (event.result.reason === ResultReason.RecognizingSpeech) {
            if (startTimeRemote === null) {
              startTimeRemote = adjustSpeakerTime({
                min: this.min,
                sec: this.sec,
                adjust: -3,
              });
            }
          }
        };

        this.recognizerRemote.recognized = (_, event) => {
          if (event.result.reason === ResultReason.RecognizedSpeech) {
            const { text } = event.result;
            if (text) {
              endTimeRemote = adjustSpeakerTime({
                min: this.min,
                sec: this.sec,
              });

              this.receiveSpeechRecognized({
                name: customerName,
                start_time: startTimeRemote,
                end_time: endTimeRemote,
                text,
                meta: null,
              });

              startTimeRemote = null;
              endTimeRemote = null;
            }
          }
        };

        this.isRecognizing = true;
      } catch (error) {
        this.isRecognizing = false;
      }
    },

    stopAndClearRecognize() {
      this.recognizerRemote?.stopContinuousRecognitionAsync();
      this.recognizerRemote?.close();
      this.recognizerLocal?.stopContinuousRecognitionAsync();
      this.recognizerLocal?.close();
      this.isRecognizing = false;
      this.recognizerRemote = null;
      this.recognizerLocal = null;
    },
  },
};
