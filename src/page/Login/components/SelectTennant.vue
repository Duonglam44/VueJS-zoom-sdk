<template>
  <Loading v-if="loading" :loading="loading" />
  <div v-else class="form-group d-flex flex-column">
    <label for="inputEmail">{{ $t('login.selectTennant') }}</label>
    <v-select
      :value="selectedTennant"
      :items="tennants"
      item-text="name"
      item-value="tennantId"
      :label="$t('login.selectTennant')"
      persistent-hint
      single-line
      @change="onChangeTennant"
    ></v-select>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';

import authService from '@/service/authService';
import axiosInstance from '@/service/axios';

import { CookiesStorage } from '@/shared/config/cookie';
import { formatApiURLByTennant } from '@/shared/utils';

export default {
  name: 'SelectTennant',

  components: {
    Loading,
  },

  data() {
    return {
      loading: true,
      tennants: [],
      selectedTennant: '',
    };
  },

  async created() {
    try {
      const oldTennant = CookiesStorage.getTennant();
      this.selectedTennant = oldTennant;
      this.loading = true;
      this.tennants = await authService.getTenants();
    } finally {
      this.loading = false;
    }
  },

  methods: {
    onChangeTennant(newTennant) {
      const oldTennant = CookiesStorage.getTennant();
      this.selectedTennant = newTennant;

      if (oldTennant !== newTennant) {
        axiosInstance.defaults.baseURL = formatApiURLByTennant(newTennant);
        CookiesStorage.setTennant(newTennant);
      }
    },
  },
};
</script>
