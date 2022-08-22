function TwilioService() {
  function getToken() {
    return Promise.resolve('dummyToken');
  }
  return {
    getToken,
  };
}

export default new TwilioService();
