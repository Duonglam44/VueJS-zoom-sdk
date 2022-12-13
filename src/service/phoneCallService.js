import axiosInstance from '@/service/axios';

const saveDataPhoneCall = (data) => {
  return axiosInstance.post('phone', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getPhraseList = () => {
  return axiosInstance.get('/phrase-list');
};

const phoneCallService = {
  saveDataPhoneCall,
  getPhraseList,
};

export default phoneCallService;
