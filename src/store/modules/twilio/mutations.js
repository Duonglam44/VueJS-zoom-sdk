const mutations = {
  setConnection(state, connection) {
    state.connection = connection;
  },

  setDevice(state, device) {
    state.device = device;
  },

  setIsShowCallTypeModal(state, value) {
    state.isShowCallTypeModal = value;
  },

  setHoldingCallSid(state, value) {
    state.holdingCallSid = value;
  },
};

export default mutations;
