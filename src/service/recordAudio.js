import AudioRecorder from 'audio-recorder-polyfill';

window.MediaRecorder = AudioRecorder;

export class RecorderAudio {
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
    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      this.audioChunks.push(event.data);
    });
  }

  start() {
    this.mediaRecorder.start();
  }

  stop() {
    return new Promise((resolve) => {
      this.mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve({ blob });
      });

      this.mediaRecorder.stop();
    });
  }

  clear() {
    this.mediaRecorder.removeEventListener('dataavailable', () => {});
    this.mediaRecorder.removeEventListener('stop', () => {});
  }
}
