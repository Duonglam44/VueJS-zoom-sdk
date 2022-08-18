import stateAuth from './state';
import actionsAuth from './actions';
import gettersAuth from './getters';
import mutationsAuth from './mutations';

export default {
  namespaced: true,
  state: stateAuth,
  getters: gettersAuth,
  actions: actionsAuth,
  mutations: mutationsAuth,
};
