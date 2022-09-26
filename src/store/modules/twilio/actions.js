import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';
import router from '@/router';

const actions = {
  disconnectCall({ state, commit }) {
    state.connection?.disconnect();
    commit('setIsShowCallTypeModal', false);
    commit('setConnection', null);
  },

  rejectCall({ state, commit }) {
    state.connection?.reject();
    commit('setIsShowCallTypeModal', false);
    commit('setConnection', null);
  },

  async handleCall({ state, commit, dispatch }, params) {
    const connection = await state.device?.connect({ params });

    const handleEndCall = () => {
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

      state.connection?.disconnect();

      const connection = await state.device?.connect({
        params: { call_sid: state.holdingCallSid },
      });

      connection
        .on('accept', () => {
          router.push({ name: 'PhoneCallRoute' });
        })
        .on('disconnect', () => {
          commit('setHoldingCallSid', '');
        });

      commit('setConnection', connection);
    } catch (error) {
      console.log('returnCall -> error', error);
    }
  },
};

export default actions;
