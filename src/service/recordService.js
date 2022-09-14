import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

export const initRecordSerive = async () => {
  await register(await connect());
};

export default class RecorderAudio {
  constructor(stream) {
    this.stream = stream;
    this.audioChunks = [];
  }

  init() {
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/wav',
    });
    this.listenEvent();
  }

  listenEvent() {
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };
  }

  start() {
    this.mediaRecorder.start();
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve({ blob });
      };

      this.mediaRecorder.stop();
    });
  }

  clear() {
    this.mediaRecorder.removeEventListener('dataavailable', () => {});
    this.mediaRecorder.removeEventListener('stop', () => {});
  }
}
