import phoneLogService from '@/service/phone-log-service';
import { uniqBy } from 'lodash';

const actions = {
  async getUsers({ commit, state, rootState }, params) {
    try {
      const { data, currentPage, nextPageUrl } = await phoneLogService.getUsers(
        params
      );

      let users = data;
      users = users.filter(
        (item) => item.userId !== rootState.auth.user.userId
      );

      if (params.page !== 1) {
        users = uniqBy([...state.users].concat(users), 'userId');
      }

      commit('setUsers', users);
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
