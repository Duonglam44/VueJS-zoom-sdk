<template>
  <v-card flat>
    <v-card-text>
      <v-list three-line>
        <AddressItem
          v-for="address in addressList"
          :key="address.id"
          :address="address"
        />
      </v-list>
    </v-card-text>
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
  computed: {
    ...mapState('phoneLog', ['addressList']),
  },
  created() {
    this.getAddressList();
  },
  methods: {
    ...mapActions('phoneLog', ['getAddressList']),
    callToAddress() {
      this.device.connect();
    },
  },
};
</script>
