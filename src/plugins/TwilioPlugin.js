import TwilioAPI from '@/service/TwilioService';
import store from '@/store';
import { Device } from '@twilio/voice-sdk';
import { INCOMING_CALL_TYPE } from '@/shared/constant/common';

const showNotification = (from) => {
  window.electron.notification.incomingCall({
    caller: from,
  });
};

const onIncoming = (connection) => {
  const send_type = connection.customParameters.get('send_type');
  const address = connection.customParameters.get('address');
  const onhold_sid = connection.customParameters.get('onhold_sid');
  const { userId } = store.state.auth.user || {};

  const handleCallConnection = () => {
    showNotification(connection.parameters.From);
    store.commit('twilio/setConnection', connection);
  };

  if (send_type) {
    if (send_type === INCOMING_CALL_TYPE.ONHOLD_INBOUND && onhold_sid) {
      // Implement call hold
    } else if (send_type === INCOMING_CALL_TYPE.SEND_OUTBOUND_CALL) {
      connection.ignore();
      return;
    } else {
      handleCallConnection();
    }
  }

  if (address === 'all' || address === userId) {
    handleCallConnection();
  } else {
    connection.ignore();
  }

  connection.on('cancel', () => {
    window.electron.notification.cancelCall();
    store.dispatch('twilio/disconnectCall');
  });

  connection.on('disconnect', () => {
    window.electron.notification.cancelCall();
    store.dispatch('twilio/disconnectCall');
  });
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
