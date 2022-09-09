import TwilioAPI from '@/service/TwilioService';
import store from '@/store';
import { Device } from '@twilio/voice-sdk';

const showNotification = (from) => {
  window.electron.notification.incomingCall({
    caller: from,
  });
};

const onIncoming = (connection) => {
  connection.on('cancel', () => {
    window.electron.notification.cancelCall();
    store.commit('twilio/setIsShowCallTypeModal', false);
  });

  showNotification(connection.parameters.From);
  store.commit('twilio/setConnection', connection);
  store.commit('twilio/setIsShowCallTypeModal', true);
};

const onRegistered = () => {};
const onDestroyed = () => {};
const onError = () => {};
const onTokenWillExpire = async (device) => {
  try {
    const res = await TwilioAPI.getToken();
    device.updateToken(res.accessToken);
  } catch (error) {
    store.commit('twilio/setDevice', null);
  }
};

const initTwilio = async () => {
  try {
    const res = await TwilioAPI.getToken();
    const device = new Device(res.accessToken, {
      codecPreferences: ['opus', 'pcmu'],
      fakeLocalDTMF: true,
      enableRingingState: true,
    });

    device
      .addListener(Device.EventName.Registered, onRegistered)
      .on(Device.EventName.Incoming, onIncoming)
      .on(Device.EventName.Destroyed, onDestroyed)
      .on(Device.EventName.Error, onError)
      .on(Device.EventName.TokenWillExpire, () => onTokenWillExpire(device));

    device.register();

    store.commit('twilio/setDevice', device);
    return device;
  } catch (e) {
    store.commit('twilio/setDevice', null);
    return null;
  }
};

export default {
  async install(app) {
    // eslint-disable-next-line no-param-reassign
    app.prototype.$initTwilio = initTwilio;
  },
};
