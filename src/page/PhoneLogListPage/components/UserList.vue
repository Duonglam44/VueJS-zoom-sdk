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
        <UserItem v-for="user in users" :key="user.userId" :user="user" />
      </v-list>
    </v-card-text>
    <infinite-loading
      v-if="usersPagination.nextPageUrl"
      identifier="user-list"
      force-use-infinite-wrapper
      spinner="spiral"
      @infinite="getMoreUser"
    >
      <div slot="no-more">{{ $t('phoneLogs.noMore') }}</div>
      <div slot="no-results">{{ $t('phoneLogs.noResults') }}</div>
    </infinite-loading>
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
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('phoneLog', ['users', 'usersPagination']),
  },
  async created() {
    this.loading = true;
    await this.getUsers({ page: 1 });
    this.loading = false;
  },
  methods: {
    ...mapActions('phoneLog', ['getUsers']),
    getMoreUser($state) {
      this.getUsers({
        page: this.usersPagination.currentPage + 1,
      }).then((users) => {
        if (users.length === 0) {
          $state.complete();
        } else {
          $state.loaded();
        }
      });
    },
  },
};
</script>
