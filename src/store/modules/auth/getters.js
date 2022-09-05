const gettersAuth = {
  isAuthenticated: (state) => !!state.user?.userId,
};

export default gettersAuth;
