const mutationsAuth = {
  setLoading(state, isLoading) {
    state.isLoading = isLoading;
  },

  setUser(state, user) {
    state.user = user;
  },

  setErrorLogin(state, errors) {
    state.errorsLogin = errors;
  },

  logout(state) {
    state.user = null;
  },

  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
};

export default mutationsAuth;
