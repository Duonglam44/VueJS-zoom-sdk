import phoneCallService from '@/service/phoneCallService';

const actions = {
  async saveDataPhoneCall(
    { commit, state },
    { remoteRecordBlob, customerNumber, localRecordBlob, memo, time }
  ) {
    try {
      const { customerSpeechResults, operatorSpeechResults } =
        state.speechResults.reduce(
          (result, item) => {
            const { operator, ...rest } = item;
            if (operator) {
              result.operatorSpeechResults.push(rest);
            } else {
              result.customerSpeechResults.push(rest);
            }
            return result;
          },
          { customerSpeechResults: [], operatorSpeechResults: [] }
        );

      const formData = new FormData();
      // send data to BE
      formData.append('customer_record_blob', remoteRecordBlob);
      formData.append('customer_number', customerNumber);
      formData.append(
        'customer_transcript',
        JSON.stringify(customerSpeechResults)
      );
      formData.append(
        'oeprator_transcript',
        JSON.stringify(operatorSpeechResults)
      );
      formData.append('oeprator_record_blob', localRecordBlob);
      formData.append('memo', memo);
      formData.append('time', time);

      const response = await phoneCallService.saveDataPhoneCall(formData);
      commit('resetSpeechResult');
      return Promise.resolve(response);
    } catch (error) {
      commit('resetSpeechResult');
      return Promise.reject(error);
    }
  },
};

export default actions;
