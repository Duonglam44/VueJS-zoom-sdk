<template>
  <div class="mx-4">
    <Loading :loading="loading" />
    <v-row>
      <v-col cols="12">
        <v-app-bar
          fixed
          color="#505c65"
          scroll-target="#scrolling-techniques-7"
        >
          <v-btn to="/" text x-large color="#505c65" class="white--text">
            ＜戻る
          </v-btn>
          <v-toolbar-title class="white--text font-weight-black">
            {{ phoneNumber }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <v-btn
            v-if="connection && connection.direction === 'INCOMING'"
            elevation="2"
            icon
            outlined
            color="white"
            class="mx-1"
            @click="createOnHold"
          >
            <v-icon>mdi-phone-settings</v-icon>
          </v-btn>

          <v-btn
            elevation="2"
            color="#f35757"
            class="white--text mx-3"
            @click="endCall"
          >
            <v-icon>mdi-phone-hangup</v-icon>終了
          </v-btn>

          <span class="white--text mx-1">
            {{ $t('phoneCall.talking') }}:
            <span v-if="!loading" id="timer_id" class="white--text mx-2">
              {{ min | padStart }}:{{ sec | padStart }}
            </span></span
          >
        </v-app-bar>
      </v-col>
    </v-row>
    <v-row style="height: calc(100vh - 64px); margin-top: 64px">
      <v-col cols="8" class="pt-6 convention-container">
        <v-row>
          <v-col cols="4">
            <v-subheader class="font-weight-black text-h6">{{
              date
            }}</v-subheader>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="4" class="pt-1">
            <v-btn
              elevation="2"
              :outlined="!autoScrolling"
              :color="autoScrolling ? 'accent' : ''"
              @click="autoScrolling = !autoScrolling"
              ><v-icon>mdi-checkbox-marked-circle</v-icon
              >{{
                autoScrolling
                  ? $t('phoneCall.autoScrollOn')
                  : $t('phoneCall.autoScrollOff')
              }}</v-btn
            >
          </v-col>
        </v-row>
        <v-row class="convention-list">
          <v-col ref="conventionList" cols="12" class="pt-6">
            <div
              v-for="item in speechResults"
              :key="`speech_result_${item.id}_${
                item.operator ? 'operator' : ''
              }`"
            >
              <div v-if="item.operator">
                <ChatBoxRight
                  :user="currentUser"
                  :chat="item"
                  :tag="item.meta"
                  @update="item.meta = $event"
                />
              </div>
              <div v-else>
                <ChatBoxLeft
                  :user="item"
                  :chat="item"
                  :tag="item.meta"
                  @update="item.meta = $event"
                />
              </div>
            </div>
          </v-col>
          <v-footer fixed color="#bbbbbb">
            <v-row>
              <v-col cols="3">
                <v-btn text x-large color="#505c65" class="white--text">
                  <v-icon>mdi-pencil</v-icon>MEMO
                </v-btn>
              </v-col>
              <v-col cols="9">
                <v-textarea
                  v-model="memo"
                  outlined
                  rows="3"
                  row-height="25"
                  background-color="#ffffff"
                  class="rounded-lg"
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </v-footer>
        </v-row>
      </v-col>
      <v-divider inset vertical></v-divider>
      <v-col cols="4" class="pt-15">
        <v-subheader class="font-weight-black text-h6">保存リスト</v-subheader>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="#ff7d7d"></v-tabs-slider>
          <v-tab
            class="rounded-t-xl white--text"
            style="background-color: #ff7d7d"
            >付箋<v-badge
              v-if="listTag && listTag.length > 0"
              inline
              :content="listTag.length"
            ></v-badge
          ></v-tab>
          <v-tab-item>
            <v-sheet block height="5" color="#ff7d7d" class="mr-1"> </v-sheet>
            <div
              v-for="item in listTag"
              :key="`list_tag_${item.operator ? 'operator' : ''}_${item.id}`"
            >
              <v-card elevation="2" class="ma-1 pa-1">
                <MemoList
                  :user="item.operator ? item : currentUser"
                  :chat="item"
                  :meta="item.meta"
                />
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';

import recordMixins from '@/mixins/record';
import recognizerMixins from '@/mixins/recognizer';

import Loading from '@/components/Loading.vue';
import ChatBoxRight from '@/components/ChatBoxRight.vue';
import ChatBoxLeft from '@/components/ChatBoxLeft.vue';
import MemoList from '@/components/MemoList.vue';

import twilioService from '@/service/twilioService';

import { formatNumber } from '@/shared/utils';

export default {
  name: 'PhoneCall',

  components: {
    Loading,
    ChatBoxRight,
    ChatBoxLeft,
    MemoList,
  },

  filters: {
    padStart(number) {
      return number.toString().padStart(2, 0);
    },
  },

  mixins: [recognizerMixins, recordMixins],

  data() {
    return {
      intervalId: null,
      date: null,
      sec: 0,
      min: 0,
      ms: 0,
      timer: null,
      msTimer: null,
      memo: '',
      autoScrolling: true,
      tab: 0,
      creatingOnHold: false,
    };
  },

  computed: {
    ...mapGetters('twilio', ['callType', 'isInCalling', 'remoteNumber']),
    ...mapState('phoneCall', ['speechResults']),

    status() {
      return this.connection?.status();
    },

    listTag() {
      return this.speechResults.filter((item) => item.meta?.tag1);
    },

    speechResultsLength() {
      return this.speechResults.length;
    },

    phoneNumber() {
      return formatNumber(this.remoteNumber);
    },
  },

  watch: {
    status: {
      handler(newValue) {
        if (newValue === 'open') {
          this.startTimer();
        } else if (newValue === 'closed') {
          this.clearTimer();
        }
      },
      immediate: true,
    },

    speechResultsLength: {
      async handler(newValue) {
        if (newValue && this.autoScrolling && !this.loading) {
          await this.$nextTick();
          const el = this.$refs.conventionList.lastElementChild;
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.date = this.$route.query.date;
    setTimeout(() => {
      this.startRecordAndRecognize();
    });
  },

  created() {
    this.connection?.on?.('disconnect', this.endCall);
  },

  async beforeDestroy() {
    this.disconnectCall();
    await this.sendRecordRecognizdData();
    this.clearTimer();
    this.setCustomerPhoneNumber('');
  },

  methods: {
    ...mapActions('twilio', ['disconnectCall']),
    ...mapMutations('twilio', ['setHoldingCallSid', 'setCustomerPhoneNumber']),

    startTimer() {
      this.playingTimer();
      this.timer = setInterval(() => this.playingTimer(), 1000);

      const start = new Date().getTime();
      this.msTimer = setInterval(() => {
        const now = new Date().getTime();
        this.ms = (now - start) % 1000;
      }, 400);
    },

    playingTimer() {
      this.sec += 1;
      if (this.sec >= 59) {
        this.sec = 0;
        this.min += 1;
      }
      if (this.min >= 59) {
        this.min = 0;
      }
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      if (this.msTimer) {
        clearInterval(this.msTimer);
        this.msTimer = null;
      }

      this.sec = 0;
      this.min = 0;
    },

    async endCall() {
      if (this.creatingOnHold) return;

      this.disconnectCall();
      await this.sendRecordRecognizdData();
      this.clearTimer();
      this.$router.push({ name: 'PhoneLogListRoute' });
    },

    async createOnHold() {
      const { CallSid: callSid = '' } = this.connection?.parameters ?? {};
      this.creatingOnHold = true;

      try {
        const response = await twilioService.createOnHold({
          callSid,
          userId: this.currentUser.userId,
        });
        const parentCallSid = response.substr(-35).substr(0, 34);
        this.setHoldingCallSid(parentCallSid);
        this.creatingOnHold = false;
        this.endCall();
      } catch (error) {
        this.creatingOnHold = false;
        console.log('createOnHold -> error', error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.convention-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 106px);
  .convention-list {
    overflow: scroll;
  }
}
</style>
