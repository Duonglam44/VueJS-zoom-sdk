import { contextBridge, ipcRenderer } from 'electron';
import ElectronStore from 'electron-store';
import { COOKIEKEY } from './shared/constant/common';

const electronStore = new ElectronStore();
const ipcRendererApi = {
  sendMessage(channel, args) {
    ipcRenderer.send(channel, args);
  },
  on(channel, func) {
    const subscription = (_event, ...args) => func(...args);
    ipcRenderer.on(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  },
  once(channel, func) {
    ipcRenderer.once(channel, (_event, ...args) => func(...args));
  },
};

const store = {
  getAuth() {
    return electronStore.get(COOKIEKEY.accessToken);
  },

  getRefreshToken() {
    return electronStore.get(COOKIEKEY.refreshToken);
  },

  setAuth(value) {
    electronStore.set(COOKIEKEY.accessToken, value);
  },

  setRefreshToken(value) {
    electronStore.set(COOKIEKEY.refreshToken, value);
  },

  removeToken() {
    electronStore.delete(COOKIEKEY.accessToken);
    electronStore.delete(COOKIEKEY.refreshToken);
  },

  removeStore() {
    electronStore.clear();
  },

  getTennant() {
    return electronStore.get(COOKIEKEY.tennant);
  },

  setTennant(value) {
    electronStore.set(COOKIEKEY.tennant, value);
  },
};

const notification = {
  incomingCall(args) {
    ipcRendererApi.sendMessage('incoming-call', args);
  },
  cancelCall() {
    ipcRendererApi.sendMessage('cancel-call');
  },
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRendererApi,
  store,
  notification,
});
