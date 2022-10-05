<template>
  <div class="d-flex">
    <v-btn icon @click="handleMonth('last')">
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
        />
      </template>

      <v-date-picker
        v-model="date"
        :type="type"
        scrollable
        locale="ja-JP"
        color="#505c65"
      >
        <v-spacer />
        <v-btn text color="primary" @click="modal = false">{{
          $t('datepicker.cancel')
        }}</v-btn>
        <v-btn text color="primary" @click="handleBtnOk()">
          {{ $t('datepicker.ok') }}
        </v-btn>
      </v-date-picker>
    </v-dialog>

    <v-btn icon @click="handleMonth('next')">
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { addMonths, format } from 'date-fns';

export const FORMAT_DATE_TYPE = {
  DATE: 'yyyy-MM-yy',
  MONTH_DATE: 'yyyy-MM',
};

export const DATEPICKER_TYPE = {
  DATE: 'date',
  MONTH: 'month',
};

export default {
  name: 'Datepicker',

  props: {
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: DATEPICKER_TYPE.MONTH,
    },
    formatType: {
      type: String,
      default: FORMAT_DATE_TYPE.MONTH_DATE,
    },
  },

  data() {
    return {
      modal: false,
      date: format(new Date(this.value), this.formatType),
    };
  },

  methods: {
    handleMonth(key) {
      const newDate = new Date(this.date);
      let tempTime = '';
      let amount = 1;

      if (key === 'last') {
        amount = -1;
      }

      tempTime = format(addMonths(newDate, amount), this.formatType);
      this.date = tempTime;
      this.$emit('input', tempTime);
    },

    handleBtnOk() {
      this.$refs.dialog.save(this.date);
      this.$emit('input', this.date);
    },
  },
};
</script>
