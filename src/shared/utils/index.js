import { isNil, omitBy } from 'lodash';
import qs from 'qs';

import { VUE_APP_BASE_API_URL, VUE_APP_TIME_ZONE } from '../config/setting';

function getCurrentDomain() {
  const parts = window.location.hostname;
  return parts;
}

function isElectron() {
  // Renderer process
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true;
  }

  return false;
}

function handlePayload(payload) {
  const newPayload = {};
  if (payload) {
    Object.keys(payload).forEach((key) => {
      newPayload[key] = payload[key] === '' ? null : payload[key];
    });
  }
  return omitBy(newPayload, isNil);
}

const stringifyParams = (data) => {
  const { params, option } = data;
  return qs.stringify(handlePayload({ ...params }), {
    arrayFormat: 'comma',
    encode: false,
    skipNull: true,
    strictNullHandling: true,
    ...option,
  });
};

function adjustSpeakerTime({ min, sec, adjust = 0, ms }) {
  const adjustSec = min * 60 + sec + adjust;

  if (Math.sign(adjustSec) === -1) {
    return '00:00';
  }

  const minute = String(Math.floor(adjustSec / 60)).padStart(2, '0');
  const second = String(Math.floor(adjustSec % 60)).padStart(2, '0');
  const milliSecond = String(ms).padStart(3, '0');

  if (typeof ms !== 'undefined') {
    return `${minute}:${second}:${milliSecond}`;
  }

  return `${minute}:${second}`;
}

function formatNumber(number) {
  const numberMatched = `${number}`.match(/([0-9+])+/g);

  if (!number || !numberMatched) return '';
  const phoneNumberStr = numberMatched.join('');

  if (phoneNumberStr.startsWith('+81') || phoneNumberStr.startsWith('0')) {
    const cleaned = `${phoneNumberStr}`.replace('+81', '0').replace(/\D/g, '');
    const matchNumber = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (matchNumber) {
      return `${matchNumber[1]}-${matchNumber[2]}-${matchNumber[3]}`;
    }

    return phoneNumberStr;
  }

  return phoneNumberStr;
}

function formatToGlobalNumber(str) {
  if (!str) return '';

  if (str.startsWith('0')) {
    return `+81${str}`;
  }

  return str;
}

function convertTimeZone(date) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: VUE_APP_TIME_ZONE,
    })
  );
}

function convertToSeconds(time) {
  const start_ary = time.split(':');
  return parseInt(start_ary[0], 10) * 60 + parseInt(start_ary[1], 10);
}

function playAudio({ start, end, buffer }) {
  if (!buffer) return false;

  return new Promise((rel) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    const startSec = convertToSeconds(start);
    const endSec = convertToSeconds(end);
    const duration = endSec - startSec;
    source.start(0, startSec, duration);
    setTimeout(() => {
      rel(true);
    }, duration * 1000);
  });
}

function formatApiURLByTennant(tennant) {
  if (!tennant) return VUE_APP_BASE_API_URL;

  return VUE_APP_BASE_API_URL.replace('__tennant__', tennant);
}

export {
  getCurrentDomain,
  isElectron,
  stringifyParams,
  adjustSpeakerTime,
  formatNumber,
  formatToGlobalNumber,
  convertTimeZone,
  convertToSeconds,
  playAudio,
  formatApiURLByTennant,
};
