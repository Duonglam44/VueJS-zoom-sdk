import { CALL_TYPE } from '@/shared/constant/common';

const getters = {
  callType(state) {
    if (!state.connection) return '';

    const sendType = state.connection.customParameters?.get('send_type');

    if (Object.values(CALL_TYPE).includes(sendType)) {
      return sendType;
    }

    return CALL_TYPE.OUTBOUND_CALL;
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
};

export default getters;
