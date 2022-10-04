import { isNil, omitBy } from 'lodash';
import qs from 'qs';

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

function adjustSpeakerTime({ min, sec, adjust = 0 }) {
  const adjustSec = min * 60 + sec + adjust;

  if (Math.sign(adjustSec) === -1) {
    return '00:00';
  }

  return `${String(Math.floor(adjustSec / 60)).padStart(2, '0')}:${String(
    Math.floor(adjustSec % 60)
  ).padStart(2, '0')}`;
}

export { getCurrentDomain, isElectron, stringifyParams, adjustSpeakerTime };
