const actions = {
  disconnectCall({ state, commit }) {
    state.connection?.disconnect();
    commit('setConnection', null);
  },

  rejectCall({ state, commit }) {
    state.connection?.reject();
    commit('setConnection', null);
  },
};

export default actions;
