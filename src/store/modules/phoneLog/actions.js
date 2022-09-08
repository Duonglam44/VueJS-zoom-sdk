import phoneLogService from '@/service/phone-log-service';

const actions = {
  async getUsers({ commit }, params) {
    try {
      const { data, currentPage, nextPageUrl } = await phoneLogService.getUsers(
        params
      );
      commit('setUsers', { data, page: params.page });
      commit('setUsersPagination', {
        currentPage,
        nextPageUrl,
      });

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getAddressList({ commit }, params) {
    try {
      const { data, currentPage, nextPageUrl } =
        await phoneLogService.getAddress(params);
      commit('setAddressList', { data, page: params.page });
      commit('setAddressListPagination', {
        currentPage,
        nextPageUrl,
      });

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default actions;
