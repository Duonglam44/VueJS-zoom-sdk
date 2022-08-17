<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <AppNavBar />
      </v-col>
    </v-row>
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
          :disabled="search === ''"
          style="min-height: 38px"
          color="success"
          class="white--text"
        >
          <v-icon left> mdi-phone</v-icon>
          {{ t('outGoing') }}
        </v-btn>
      </v-col>
    </v-row>
    <PhoneLogList
      :title="t('monthSection')"
      :history="call_logs"
      @item-clicked="onItemClick"
    />
    <PhoneLogList
      :title="t('daySection')"
      :history="call_logs"
      @item-clicked="onItemClick"
    />
  </v-container>
</template>

<script>
import AppNavBar from '@/components/AppNavBar.vue';
import PhoneLogList from '@/components/PhoneLogList.vue';

export default {
  name: 'PhoneLogListPage',
  components: {
    PhoneLogList,
    AppNavBar,
  },
  data() {
    return {
      timerId: null,
      modal: false,
      date: new Date().toISOString().substr(0, 7),
      search: '',
      call_logs: undefined,
      caller: false,
      customer_user: {
        avator: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        name: '〇〇工務店 伊藤様',
        number: '090-111-1111',
      },
      customer_user_name: '〇〇工務店 伊藤様',
    };
  },
  mounted() {
    this.dummy_setup();
  },
  methods: {
    t(key) {
      return this.$t(`phoneLogs.${key}`).toString();
    },
    onItemClick(url) {
      this.$router.push(url);
    },
    dummy_setup() {
      fetch('/test_data/phone_log_list.json')
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.call_logs = data;
        });
      fetch('/test_data/phone_call.json')
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.customer_user = data.customer_user;
        });
    },
  },
};
</script>
