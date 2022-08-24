const gettersAuth = {
  isAuthenticated: (state) => !!state.user.accessToken,
};

export default gettersAuth;
