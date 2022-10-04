const COOKIEKEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};

const INCOMING_CALL_TYPE = {
  INBOUND_CALL: 'inbound_call',
  ONHOLD_INBOUND: 'onhold_inbound',
  SEND_OUTBOUND_CALL: 'send_out_bound',
};

const OUTGOING_CALL_TYPE = {
  IN_BOUND: 'in_bound',
  ONHOLD_INBOUND: 'onhold_inbound',
  SEND_OUTBOUND_CALL: 'send_out_bound',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

const REGION_OPTIONS = 'japaneast';
const SPEECH_RECOGNITION_LANGUAGE = 'ja-JP';

export {
  COOKIEKEY,
  INCOMING_CALL_TYPE,
  OUTGOING_CALL_TYPE,
  HTTP_STATUS,
  REGION_OPTIONS,
  SPEECH_RECOGNITION_LANGUAGE,
};
