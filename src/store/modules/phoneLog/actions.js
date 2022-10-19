import phoneLogsService from '@/service/phoneLogsService';
import addressService from '@/service/addressService';
import { uniqBy } from 'lodash';

const actions = {
  async getUsers({ commit, state, rootState }, params) {
    try {
      const { data, currentPage, nextPageUrl } =
        await phoneLogsService.getUsers(params);

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
        await addressService.getAddress(params);
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
  async getRecordFile({ commit }, { phoneLogId, cancelToken }) {
    try {
      commit('setRecordBuffer', { fileFromBuffer: null, fileToBuffer: null });
      const [fileFromBuffer, fileToBuffer] = await Promise.all([
        phoneLogsService.getFileFromRecord(phoneLogId, cancelToken),
        phoneLogsService.getFileToRecord(phoneLogId, cancelToken),
      ]);
      commit('setRecordBuffer', { fileFromBuffer, fileToBuffer });
    } catch (error) {
      commit('setRecordBuffer', { fileFromBuffer: null, fileToBuffer: null });
    }
  },
};

export default actions;
