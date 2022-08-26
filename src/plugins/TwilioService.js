import TwilioAPI from '@/service/twilioAPI';
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
  });

  showNotification(connection.parameters.From);
  store.commit('connection/setConnection', connection);
};

const onRegistered = () => {};
const onDestroyed = () => {};
const onError = () => {};
const onTokenWillExpire = () => {};

const initTwilio = async () => {
  try {
    const res = await TwilioAPI.getToken();
    const device = new Device(res.data.token, {
      codecPreferences: ['opus', 'pcmu'],
      fakeLocalDTMF: true,
      enableRingingState: true,
    });

    device
      .addListener(Device.EventName.Registered, onRegistered)
      .on(Device.EventName.Incoming, onIncoming)
      .on(Device.EventName.Destroyed, onDestroyed)
      .on(Device.EventName.Error, onError)
      .on(Device.EventName.TokenWillExpire, onTokenWillExpire);

    return device;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
};

export default {
  async install(app) {
    // eslint-disable-next-line no-param-reassign
    app.prototype.$device = await initTwilio();
  },
};
