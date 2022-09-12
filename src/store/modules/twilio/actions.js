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
};

export default actions;
