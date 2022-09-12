import uniqBy from 'lodash/uniqBy';

const mutations = {
  setUsers(state, { data, page }) {
    if (page === 1) {
      state.users = data;
    } else {
      state.users = uniqBy([...state.users].concat(data), 'userId');
    }
  },
  setAddressList(state, { data, page }) {
    if (page === 1) {
      state.addressList = data;
    } else {
      state.addressList = uniqBy(
        [...state.addressList].concat(data),
        'phoneNumber'
      );
    }
  },
  setAddressListPagination(state, pagination) {
    state.addressListPagination = pagination;
  },
  setUsersPagination(state, pagination) {
    state.usersPagination = pagination;
  },
};

export default mutations;
