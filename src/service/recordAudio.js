import { MediaRecorder } from 'extendable-media-recorder';

export class RecorderAudio {
  constructor(stream) {
    this.stream = stream;
    this.audioChunks = [];
  }

  init() {
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/wav',
      bitsPerSecond: 16000,
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
