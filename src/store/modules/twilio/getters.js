import { INCOMING_CALL_TYPE } from '@/shared/constant/common';

const getters = {
  callType(state) {
    if (!state.connection) return '';

    const sendType = state.connection.customParameters?.get('send_type');

    if (Object.values(INCOMING_CALL_TYPE).includes(sendType)) {
      return sendType;
    }

    return INCOMING_CALL_TYPE.SEND_OUTBOUND_CALL;
  },

  isInCalling(state) {
    if (
      state.connection?.status() === 'pending' ||
      state.connection?.status() === 'open'
    ) {
      return true;
    }

    return false;
  },

  remoteNumber(state) {
    return state.connection?.direction === 'INCOMING'
      ? state.connection?.parameters.From
      : state.connection?.customParameters?.get?.('To');
  },
};

export default getters;
