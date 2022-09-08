const actions = {
  async getUsers({ commit }) {
    try {
      // TODO: call API and get data commit to vuex

      commit('setUsers', [
        {
          id: '1',
          profile_image: 'sda',
          phone_number: '050-3188-6036',
          name: 'unixonテストユーザー1',
        },
        {
          id: '2',
          profile_image: 'sda',
          phone_number: '050-3188-6036',
          name: 'unixonテストユーザー1',
        },
      ]);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getAddressList({ commit }) {
    try {
      // TODO: call API and get data commit to vuex

      commit('setAddressList', [
        {
          id: '1',
          phone_number: '050-3188-6036',
          name: 'unixonテストユーザー1',
        },
        {
          id: '2',
          phone_number: '050-3188-6036',
          name: 'unixonテストユーザー1',
        },
      ]);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default actions;
