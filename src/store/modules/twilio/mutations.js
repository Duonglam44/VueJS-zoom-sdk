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

  setCustomerPhoneNumber(state, value) {
    state.customerPhoneNumber = value;
  },
};

export default mutations;
