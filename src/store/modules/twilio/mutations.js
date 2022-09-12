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
};

export default mutations;
