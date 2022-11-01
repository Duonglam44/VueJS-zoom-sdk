import {
  OUTGOING_CALL_TYPE,
  INCOMING_CALL_TYPE,
} from '@/shared/constant/common';
import router from '@/router';

const actions = {
  disconnectCall({ state, commit }) {
    state.connection?.disconnect();
    commit('setIsShowCallTypeModal', false);
    commit('setIsShowIncomingCallDialog', false);
    commit('setConnection', null);
  },

  rejectCall({ state, commit }) {
    state.connection?.reject();
    commit('setIsShowCallTypeModal', false);
    commit('setIsShowIncomingCallDialog', false);
    commit('setConnection', null);
  },

  ignoreCall({ state, commit }) {
    state.connection?.ignore();
    commit('setIsShowCallTypeModal', false);
    commit('setIsShowIncomingCallDialog', false);
    commit('setConnection', null);
  },

  acceptCall({ state, commit, getters }) {
    state.connection?.accept();
    commit('setIsShowIncomingCallDialog', false);
    state.connection?.on('accept', () => {
      if (getters.callType === INCOMING_CALL_TYPE.SEND_OUTBOUND_CALL) {
        router.push({ name: 'PhoneCallRoute' });

        return;
      }

      commit('setIsShowCallTypeModal', true);
    });
  },

  callRejectHandler({ state, dispatch }) {
    const address = state.connection?.customParameters?.get?.('address');

    if (address === 'all') {
      dispatch('ignoreCall');
    } else {
      dispatch('rejectCall');
    }
  },

  async handleCall({ state, commit, dispatch }, params) {
    const connection = await state.device?.connect({ params });

    const handleEndCall = () => {
      if (params.call_type === OUTGOING_CALL_TYPE.ONHOLD_INBOUND) {
        commit('phoneLog/setRecallList', true, { root: true });
      }
      dispatch('disconnectCall');
    };

    connection
      .on('accept', () => {
        if (
          params.call_sid ||
          params.call_type === OUTGOING_CALL_TYPE.SEND_OUTBOUND_CALL
        ) {
          commit('setIsShowCallTypeModal', false);
          router.push({ name: 'PhoneCallRoute' });

          return;
        }

        commit('setIsShowCallTypeModal', true);
      })
      .on('ignore', handleEndCall)
      .on('hangup', handleEndCall)
      .on('disconnect', handleEndCall)
      .on('reject', handleEndCall);

    commit('setConnection', connection);
  },

  async returnCall({ state, commit }) {
    try {
      if (!state.holdingCallSid) throw Error(`holdingCallSid is required`);
      const tempCustomerPhoneNumber = state.customerPhoneNumber;

      state.connection?.disconnect();

      const connection = await state.device?.connect({
        params: { call_sid: state.holdingCallSid },
      });
      commit('setHoldingCallSid', '');
      commit('setCustomerPhoneNumber', tempCustomerPhoneNumber);

      connection.on('accept', () => {
        router.push({ name: 'PhoneCallRoute' });
      });

      commit('setConnection', connection);
    } catch (error) {
      console.log('returnCall -> error', error);
    }
  },
};

export default actions;
