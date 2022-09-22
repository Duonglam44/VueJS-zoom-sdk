<template>
  <div>
    <v-row class="mt-13">
      <v-col cols="5" class="d-flex">
        <Datepicker
          v-model="time"
          :type="datepickerType.MONTH"
          :format-type="formatDateType.MONTH_DATE"
        />
      </v-col>

      <v-col style="padding-top: 8px" cols="5">
        <v-text-field
          v-model="search"
          dense
          solo
          prepend-inner-icon="mdi-magnify"
          :placeholder="$t('phoneLogs.searchPlaceholder')"
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
          {{ $t('phoneLogs.outGoing') }}
        </v-btn>
      </v-col>
    </v-row>

    <PhoneLogList
      :is-today="true"
      :status="apiStatusTodayList"
      :phone-logs="todayPhoneLogs"
      :title="$t('phoneLogs.daySection')"
      :historys="todayPhoneLogs.data || []"
      :total="todayPhoneLogs.total"
      :per-page="todayPhoneLogs.perPage"
      :page-selected="currentPageToday"
      @page-changed="reloadTodayList"
      @item-clicked="onItemClick"
      @reload-data="reloadData"
    />

    <PhoneLogList
      :status="apiStatus"
      :phone-logs="phoneLogs"
      :title="titleList"
      :historys="phoneLogs.data || []"
      :total="phoneLogs.total"
      :per-page="phoneLogs.perPage"
      :page-selected="currentPageThisMonth"
      @page-changed="reloadMonthList"
      @item-clicked="onItemClick"
      @reload-data="reloadData"
    />
    <CallAwayDialog
      v-if="dialogCall"
      :open-dialog="dialogCall"
      @toggle-dialog="(value) => (dialogCall = value)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { format } from 'date-fns';
import { ApiStatus } from '@/store/constants';
import PhoneLogList from '@/components/PhoneLogList.vue';
import phoneLogsService from '@/service/PhoneLogsService';
import Datepicker, {
  FORMAT_DATE_TYPE,
  DATEPICKER_TYPE,
} from '@/components/commons/Datepicker.vue';
import CallAwayDialog from './components/CallAwayDialog.vue';

export default {
  name: 'PhoneLogListPage',

  components: {
    CallAwayDialog,
    PhoneLogList,
    Datepicker,
  },

  data() {
    return {
      search: '',
      time: format(new Date(), FORMAT_DATE_TYPE.MONTH_DATE),
      dialogCall: false,
      phoneLogs: {},
      todayPhoneLogs: {},
      apiStatus: ApiStatus.IDLE,
      apiStatusTodayList: ApiStatus.IDLE,
      currentPageThisMonth: 1,
      currentPageToday: 1,
      formatDateType: FORMAT_DATE_TYPE,
      datepickerType: DATEPICKER_TYPE,
    };
  },

  computed: {
    ...mapState('twilio', ['device']),

    titleList() {
      const currentMonth = format(new Date(), FORMAT_DATE_TYPE.MONTH_DATE);
      if (currentMonth === this.time) {
        return this.$t('phoneLogs.monthSection');
      }
      const month = this.time.split('-')[1];
      return this.$t('phoneLogs.month', { month });
    },
  },

  watch: {
    time: {
      handler(newValue, oldValue) {
        if (!oldValue) return;
        this.loadPhoneLogs(this.currentPageThisMonth, newValue);
      },
      immediate: true,
    },
  },

  mounted() {
    this.loadTodayPhoneLogs();
    this.loadPhoneLogs();
  },

  methods: {
    reloadData() {
      this.reloadTodayList(this.currentPageToday);
      this.reloadMonthList(this.currentPageThisMonth);
    },

    reloadMonthList(page) {
      this.currentPageThisMonth = page;
      this.loadPhoneLogs(page, this.time);
    },

    reloadTodayList(page) {
      this.currentPageToday = page;
      this.loadTodayPhoneLogs();
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

    async loadPhoneLogs(page = 1, time = this.time) {
      const [year, month] = time.split('-');
      this.apiStatus = ApiStatus.LOADING;
      try {
        this.phoneLogs = await phoneLogsService.getPhoneLogs({
          page,
          year,
          month,
        });
        this.apiStatus = ApiStatus.SUCCESS;
      } catch (error) {
        this.apiStatus = ApiStatus.FAILURE;
      }
    },
  },
};
</script>
