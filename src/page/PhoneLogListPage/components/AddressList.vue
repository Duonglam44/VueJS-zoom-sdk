<template>
  <v-skeleton-loader
    v-if="loading"
    class="mx-auto"
    max-width="400"
    type="list-item-avatar-three-line"
  />
  <v-card v-else flat max-height="500" style="overflow: auto">
    <v-card-text>
      <v-list three-line>
        <AddressItem
          v-for="address in addressList"
          :key="address.phoneNumber"
          :address="address"
        />
      </v-list>
    </v-card-text>
    <infinite-loading
      v-if="addressListPagination.nextPageUrl"
      identifier="address-list"
      force-use-infinite-wrapper
      spinner="spiral"
      @infinite="getMoreAddress"
    >
      <div slot="no-more">{{ $t('phoneLogs.noMore') }}</div>
      <div slot="no-results">{{ $t('phoneLogs.noResults') }}</div>
    </infinite-loading>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import AddressItem from './AddressItem.vue';

export default {
  name: 'AddressList',
  components: {
    AddressItem,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('phoneLog', ['addressList', 'addressListPagination']),
  },
  async created() {
    this.loading = true;
    await this.getAddressList({ page: 1 });
    this.loading = false;
  },
  methods: {
    ...mapActions('phoneLog', ['getAddressList']),
    getMoreAddress($state) {
      this.getAddressList({
        page: this.addressListPagination.currentPage + 1,
      }).then((address) => {
        if (address.length === 0) {
          $state.complete();
        } else {
          $state.loaded();
        }
      });
    },
  },
};
</script>
