import TwilioAPI from '@/service/TwilioService';
import store from '@/store';
import { Device, Call } from '@twilio/voice-sdk';
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
  const customer_phone_number = connection.customParameters.get(
    'customer_phone_number'
  );
  const { userId } = store.state.auth.user || {};

  const handleCallConnection = () => {
    showNotification(connection.parameters.From);
    store.commit('twilio/setConnection', connection);

    connection.on('cancel', () => {
      window.electron.notification.cancelCall();
      store.dispatch('twilio/disconnectCall');
      store.commit('twilio/setCustomerPhoneNumber', '');
    });

    connection.on('disconnect', () => {
      window.electron.notification.cancelCall();
      store.dispatch('twilio/disconnectCall');
      store.commit('twilio/setCustomerPhoneNumber', '');
    });
  };

  if (send_type) {
    if (send_type === INCOMING_CALL_TYPE.ONHOLD_INBOUND && onhold_sid) {
      store.commit('twilio/setHoldingCallSid', onhold_sid);
      store.commit('twilio/setCustomerPhoneNumber', customer_phone_number);
      handleCallConnection();
    } else if (send_type === INCOMING_CALL_TYPE.SEND_OUTBOUND_CALL) {
      connection.ignore();
      return;
    }
  }

  switch (address) {
    case 'all':
      handleCallConnection();
      break;
    case userId: {
      const status = store.state.twilio.connection?.status?.();

      if (status === Call.State.Closed || !status) {
        handleCallConnection();
      } else {
        connection.reject();
      }

      break;
    }

    default:
      connection.ignore();
      break;
  }
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
