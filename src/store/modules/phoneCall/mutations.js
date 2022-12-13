import { replacePhraseList } from '@/shared/utils/phoneCall';

const mutations = {
  receiveSpeechRecognized(state, item) {
    let newItem = {};
    if (item.operator) {
      newItem = {
        ...item,
        id: state.operatorResultIndex,
        index: state.operatorResultIndex,
        text: replacePhraseList(item.text, state.phraseList),
      };

      state.operatorResultIndex += 1;
    } else {
      newItem = {
        ...item,
        id: state.customerResultIndex,
        index: state.customerResultIndex,
        text: replacePhraseList(item.text, state.phraseList),
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

  setPhraseList(state, payload) {
    state.phraseList = payload;
  },
};

export default mutations;
