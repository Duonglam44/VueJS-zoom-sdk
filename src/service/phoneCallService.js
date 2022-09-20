import axiosInstance from '@/service/axios';

const saveDataPhoneCall = (data) => {
  return axiosInstance.post('phone', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const phoneCallService = {
  saveDataPhoneCall,
};

export default phoneCallService;
