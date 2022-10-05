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
    const callState = state.connection?.status();

    return ['pending', 'open'].includes(callState);
  },

  remoteNumber(state) {
    if (state.customerPhoneNumber) {
      return state.customerPhoneNumber;
    }

    return state.connection?.direction === 'INCOMING'
      ? state.connection?.parameters.From
      : state.connection?.customParameters?.get?.('To');
  },
};

export default getters;
