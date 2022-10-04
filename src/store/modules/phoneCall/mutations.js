const mutations = {
  receiveSpeechRecognized(state, item) {
    let newItem = item;
    if (item.operator) {
      newItem = {
        ...item,
        id: state.operatorResultIndex,
        index: state.operatorResultIndex,
      };

      state.operatorResultIndex += 1;
    } else {
      newItem = {
        ...item,
        id: state.customerResultIndex,
        index: state.customerResultIndex,
      };

      state.customerResultIndex += 1;
    }

    state.speechResults.push(newItem);
  },

  resetSpeechResult(state) {
    state.speechResults = [];
    state.operatorResultIndex = 1;
    state.customerResultIndex = 1;
  },
};

export default mutations;
