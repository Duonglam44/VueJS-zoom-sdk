<template>
  <div>
    <v-row class="mt-13">
      <v-col cols="5" class="d-flex">
        <v-btn icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              prepend-inner-icon="mdi-calendar"
              readonly
              dense
              solo
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>

          <v-date-picker
            v-model="date"
            type="month"
            scrollable
            locale="ja-JP"
            color="#505c65"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false"> Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>

        <v-btn icon>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>

      <v-col style="padding-top: 8px" cols="5">
        <v-text-field
          v-model="search"
          dense
          solo
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('searchPlaceholder')"
          class="my-auto pa-1"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <v-btn
          style="min-height: 38px"
          color="success"
          class="white--text"
          @click="dialogCall = true"
        >
          <v-icon left> mdi-phone</v-icon>
          {{ t('outGoing') }}
        </v-btn>
      </v-col>
    </v-row>

    <PhoneLogList
      :status="apiStatusTodayList"
      :phone-logs="todayPhoneLogs"
      :title="t('daySection')"
      :historys="todayPhoneLogs.data || []"
      :total="todayPhoneLogs.total"
      :per-page="todayPhoneLogs.perPage"
      @page-changed="loadTodayPhoneLogs"
      @item-clicked="onItemClick"
    />

    <PhoneLogList
      :status="apiStatus"
      :phone-logs="phoneLogs"
      :title="t('monthSection')"
      :historys="phoneLogs.data || []"
      :total="phoneLogs.total"
      :per-page="phoneLogs.perPage"
      @page-changed="loadPhoneLogs"
      @item-clicked="onItemClick"
    />
    <CallAwayDialog
      :open-dialog="dialogCall"
      @toggle-dialog="(value) => (dialogCall = value)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ApiStatus } from '@/store/constants';
import PhoneLogList from '@/components/PhoneLogList.vue';
import phoneLogsService from '@/service/PhoneLogsService';
import CallAwayDialog from './components/CallAwayDialog.vue';

export default {
  name: 'PhoneLogListPage',

  components: {
    CallAwayDialog,
    PhoneLogList,
  },

  data() {
    return {
      search: '',
      modal: false,
      date: new Date().toISOString().substr(0, 7),
      dialogCall: false,
      phoneLogs: {},
      todayPhoneLogs: {},
      apiStatus: ApiStatus.IDLE,
      apiStatusTodayList: ApiStatus.IDLE,
    };
  },

  computed: {
    ...mapState('twilio', ['device']),
  },

  mounted() {
    this.loadTodayPhoneLogs();
    this.loadPhoneLogs();
  },

  methods: {
    t(key) {
      return this.$t(`phoneLogs.${key}`).toString();
    },

    onItemClick() {
      // fixme: dummy data. replace with /phone_log?id=xxx
      this.$router.push('/phone_log?date=2022-03-04');
    },

    async loadTodayPhoneLogs(page = 1) {
      this.apiStatusTodayList = ApiStatus.LOADING;
      try {
        this.todayPhoneLogs = await phoneLogsService.getTodayPhoneLogs({
          page,
        });
        this.apiStatusTodayList = ApiStatus.SUCCESS;
      } catch (error) {
        this.apiStatusTodayList = ApiStatus.FAILURE;
      }
    },

    async loadPhoneLogs(page = 1) {
      this.apiStatus = ApiStatus.LOADING;
      try {
        this.phoneLogs = await phoneLogsService.getPhoneLogs({ page });
        this.apiStatus = ApiStatus.SUCCESS;
      } catch (error) {
        this.apiStatus = ApiStatus.FAILURE;
      }
    },
  },
};
</script>
