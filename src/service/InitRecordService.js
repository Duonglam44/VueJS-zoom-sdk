import { register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

class InitRecordService {
  async initService() {
    if (!this.instance) {
      await register(await connect());
      this.instance = true;
    }
  }
}

export default new InitRecordService();
