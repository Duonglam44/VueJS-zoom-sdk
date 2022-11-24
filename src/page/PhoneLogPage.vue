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
            {{ `＜${$t('button.back')}` }}
          </v-btn>
          <v-toolbar-title class="white--text font-weight-black">
            {{ getData(phoneLog.address, 'name', customerPhoneFormated || '') }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <audio
            v-if="phoneLog.phoneLogId"
            controls
            :src="phoneFromRecordURL"
          />
          <audio v-if="phoneLog.phoneLogId" controls :src="phoneToRecordURL" />
        </v-app-bar>
      </v-col>
    </v-row>
    <v-row style="height: calc(100vh - 64px); margin-top: 64px">
      <v-col cols="8" class="pt-6 convention-container">
        <v-row class="convention-list">
          <v-col cols="12" class="pt-6">
            <div
              v-for="(item, index) in phoneLog.phoneTalkLogs"
              :key="item.phoneTalkLogId"
            >
              <div v-if="item.speakerNumber !== phoneLog.customerPhoneNumber">
                <ChatBoxRight
                  :user="getData(item.user, '[0]', {})"
                  :chat="item"
                  :tag="convertToObject(item.vttMeta)"
                  show-replay
                  @update="updateTag($event, index)"
                />
              </div>
              <div v-else>
                <ChatBoxLeft
                  :user="getCustomer(item.address, '[0]')"
                  :chat="item"
                  :tag="convertToObject(item.vttMeta)"
                  show-replay
                  @update="updateTag($event, index)"
                />
              </div>
            </div>
          </v-col>
          <v-footer fixed color="#bbbbbb">
            <v-row>
              <v-col cols="2">
                <v-btn
                  text
                  x-large
                  color="#505c65"
                  class="white--text"
                  :loading="updatingMemo"
                  @click="updateMemo"
                >
                  <v-icon>mdi-pencil</v-icon>MEMO
                </v-btn>
              </v-col>
              <v-col cols="10">
                <v-textarea
                  v-model="phoneLog.memo"
                  outlined
                  hide-details
                  rows="3"
                  row-height="25"
                  background-color="#ffffff"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
          </v-footer>
        </v-row>
      </v-col>
      <v-divider inset vertical></v-divider>
      <v-col cols="4" class="pt-6 convention-container">
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
            <div v-for="item in listTag" :key="item.phoneTalkLogId">
              <v-card elevation="2" class="ma-1 pa-1">
                <div v-if="item.speakerNumber !== phoneLog.customerPhoneNumber">
                  <MemoList
                    :user="getData(item.user, '[0]', {})"
                    :chat="item"
                    :meta="convertToObject(item.vttMeta)"
                  />
                </div>
                <div v-else>
                  <MemoList
                    :user="getCustomer(item.address, '[0]')"
                    :chat="item"
                    :meta="convertToObject(item.vttMeta)"
                  />
                </div>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { get } from 'lodash';
import { mapActions } from 'vuex';

import ChatBoxRight from '@/components/ChatBoxRight.vue';
import ChatBoxLeft from '@/components/ChatBoxLeft.vue';
import MemoList from '@/components/MemoList.vue';
import Loading from '@/components/Loading.vue';

import phoneLogsService from '@/service/phoneLogsService';

import { VUE_APP_URL_RESOURCE } from '@/shared/config/setting';
import { formatNumber } from '@/shared/utils';
import Axios from 'axios';

export default {
  name: 'PhoneLogPage',

  components: {
    ChatBoxRight,
    ChatBoxLeft,
    MemoList,
    Loading,
  },
  data() {
    return {
      loading: false,
      tab: 0,
      phoneLog: {},
      cancelGetRecord: null,
      updatingMemo: false,
    };
  },

  computed: {
    listTag() {
      return this.phoneLog.phoneTalkLogs?.filter(
        (item) => this.convertToObject(item.vttMeta)?.tag1
      );
    },

    phoneToRecordURL() {
      const [, ...arrLink] = (this.phoneLog?.wavFileFromPath || '').split('/');
      return `${VUE_APP_URL_RESOURCE}/${arrLink.join('/')}`;
    },

    phoneFromRecordURL() {
      const [, ...arrLink] = (this.phoneLog?.wavFileToPath || '').split('/');
      return `${VUE_APP_URL_RESOURCE}/${arrLink.join('/')}`;
    },

    customerPhoneFormated() {
      return formatNumber(this.phoneLog.customerPhoneNumber);
    },
  },

  async created() {
    const { id } = this.$route.params;
    try {
      this.loading = true;
      this.phoneLog = await phoneLogsService.getPhoneLogDetail(id);

      this.cancelGetRecord = Axios.CancelToken.source();
      this.getRecordFile({
        phoneLogId: id,
        cancelToken: this.cancelGetRecord.token,
      });
    } finally {
      this.loading = false;
    }
  },

  beforeDestroy() {
    if (this.cancelGetRecord) {
      this.cancelGetRecord.cancel();
      this.cancelGetRecord = null;
    }
  },

  methods: {
    ...mapActions('phoneLog', ['getRecordFile']),

    getData(object, key, valueDefault = '') {
      return get(object, key, valueDefault);
    },

    async updateMemo() {
      if (this.updatingMemo) return;

      try {
        this.updatingMemo = true;
        await phoneLogsService.updateMemo(this.phoneLog.phoneLogId, {
          memo: this.phoneLog.memo,
        });
      } finally {
        this.updatingMemo = false;
      }
    },

    updateTag($event, index) {
      this.phoneLog.phoneTalkLogs[index].vttMeta = $event;
      const { phoneTalkLogId } = this.phoneLog.phoneTalkLogs[index];
      phoneLogsService.updateTagPhoneTalk({ id: phoneTalkLogId, meta: $event });
    },

    convertToObject(meta) {
      if (typeof meta !== 'string') return meta;

      return JSON.parse(meta || '{}');
    },

    getCustomer(object, key) {
      return get(object, key, { name: this.customerPhoneFormated });
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
    overflow-y: scroll;
  }
  .v-tabs--align-with-title {
    overflow-y: scroll;
  }
}
</style>
