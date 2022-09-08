<template>
  <v-card flat>
    <v-card-text>
      <v-list three-line>
        <UserItem v-for="user in users" :key="user.id" :user="user" />
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import UserItem from './UserItem.vue';

export default {
  name: 'UserList',
  components: {
    UserItem,
  },
  computed: {
    ...mapState('phoneLog', ['users']),
  },
  created() {
    this.getUsers();
  },
  methods: {
    ...mapActions('phoneLog', ['getUsers']),
    callToAddress() {
      this.device.connect();
    },
  },
};
</script>
