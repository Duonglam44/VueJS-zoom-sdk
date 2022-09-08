<template>
  <v-container>
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
      :status="apiStatus"
      :total-page="thisMonthPhoneLogs.totalPage"
      :title="t('monthSection')"
      :history="thisMonthPhoneLogs.data"
      @page-changed="(p) => onPageChange(p, 'thisMonthPhoneLogs')"
      @item-clicked="onItemClick"
    />
    <CallAwayDialog :open-dialog="dialogCall" @toggle-dialog="dialogCall" />
  </v-container>
</template>

<script>
import PhoneLogList from '@/components/PhoneLogList.vue';
import phoneLogService from '@/service/phone-log-service';
import { mapState } from 'vuex';
import CallAwayDialog from './components/CallAwayDialog.vue';

export default {
  name: 'PhoneLogListPage',
  components: {
    CallAwayDialog,
    PhoneLogList,
  },
  data() {
    return {
      todayPhoneLogs: {
        totalPage: 1,
        currentPage: 1,
        data: [],
      },
      thisMonthPhoneLogs: {
        totalPage: 1,
        currentPage: 1,
        data: [],
      },
      search: '',
      apiStatus: 'IDLE',
      modal: false,
      date: new Date().toISOString().substr(0, 7),
      dialogCall: false,
    };
  },

  computed: {
    ...mapState('twilio', ['device']),
  },

  mounted() {
    this.loadPhoneLogs();
  },

  methods: {
    onPageChange(page, key) {
      this[key].currentPage = page;
      this.loadPhoneLogs(page);
    },
    t(key) {
      return this.$t(`phoneLogs.${key}`).toString();
    },
    onItemClick() {
      // fixme: dummy data. replace with /phone_log?id=xxx
      this.$router.push('/phone_log?date=2022-03-04');
    },
    loadPhoneLogs(page = 1) {
      this.apiStatus = 'PENDING';
      phoneLogService
        .getAll(page)
        .then((res) => {
          this.thisMonthPhoneLogs = this.mapResponseToData(res);
          this.apiStatus = 'SUCCESS';
        })
        .catch(() => {
          this.apiStatus = 'ERROR';
        });
    },
    mapResponseToData({ total, per_page, ...res }) {
      return {
        ...res,
        totalPage: Math.ceil(total / per_page),
      };
    },
  },
};
</script>
