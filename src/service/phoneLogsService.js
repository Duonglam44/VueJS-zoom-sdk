import axiosInstance from '@/service/axios';

const getPhoneLogs = (params) => {
  return axiosInstance.get('phone_logs', { params });
};

const getTodayPhoneLogs = (params) => {
  return axiosInstance.get('phone_logs/today', { params });
};

function getUsers(params) {
  return axiosInstance.get('users', { params });
}

const getPhoneLogDetail = (id) => {
  return axiosInstance.get(`phone_logs/${id}`);
};

const updateMemo = (id, data) => {
  return axiosInstance.post(`phone_logs/${id}/memo`, data);
};

const updateTagPhoneTalk = (data) => {
  return axiosInstance.post('phone_logs/phone_talk_log', data);
};

const getFileFromRecord = async (phoneLogId, cancelToken) => {
  try {
    let bufferRes = null;
    const response = await axiosInstance.get(
      `phone_logs/${phoneLogId}/get_wav_from_url`,
      {
        responseType: 'arraybuffer',
        cancelToken,
      }
    );
    await new AudioContext().decodeAudioData(response.data, (buffer) => {
      bufferRes = buffer;
    });
    return bufferRes;
  } catch (error) {
    return null;
  }
};

const getFileToRecord = async (phoneLogId, cancelToken) => {
  try {
    let bufferRes = null;
    const response = await axiosInstance.get(
      `phone_logs/${phoneLogId}/get_wav_to_url`,
      {
        responseType: 'arraybuffer',
        cancelToken,
      }
    );
    await new AudioContext().decodeAudioData(response.data, (buffer) => {
      bufferRes = buffer;
    });
    return bufferRes;
  } catch (error) {
    return null;
  }
};

const phoneLogsService = {
  getPhoneLogs,
  getTodayPhoneLogs,
  getUsers,
  getPhoneLogDetail,
  updateMemo,
  updateTagPhoneTalk,
  getFileFromRecord,
  getFileToRecord,
};

export default phoneLogsService;
