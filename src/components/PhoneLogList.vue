<template>
  <v-card class="mt-8 pb-4">
    <v-list subheader>
      <v-list-item-group>
        <v-subheader class="font-weight-bold header-list">{{
          title
        }}</v-subheader>
        <ListContainer :status="status" :is-data="!!historys.length">
          <div v-for="(item, index) in historys" :key="item.phoneLogId">
            <v-list-item @click.native="$emit('item-clicked', item.phoneLogId)">
              <div>
                <template v-if="isToday && item.onHold">
                  <v-list-item-action>
                    <v-menu
                      bottom
                      origin="center center"
                      transition="scale-transition"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="success"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          @click.prevent="getUserList"
                        >
                          {{ $t('phoneLogs.onHold') }}
                          <v-icon right> mdi-menu-down </v-icon>
                        </v-btn>
                      </template>

                      <v-skeleton-loader
                        v-if="loading"
                        class="mx-auto"
                        type="list-item-two-line"
                      />
                      <v-list v-else>
                        <v-list-item>
                          <v-list-item-title>{{
                            $t('phoneLogs.goOut')
                          }}</v-list-item-title>
                        </v-list-item>

                        <div>
                          <v-list-item v-for="user in users" :key="user.userId">
                            <v-list-item-title>{{
                              user.name
                            }}</v-list-item-title>
                          </v-list-item>

                          <infinite-loading
                            v-if="usersPagination.nextPageUrl"
                            identifier="user-list-on-hold"
                            force-use-infinite-wrapper
                            spinner="spiral"
                            @infinite="getMoreUsers"
                          >
                            <div slot="no-more">
                              {{ $t('phoneLogs.noMore') }}
                            </div>
                            <div slot="no-results">
                              {{ $t('phoneLogs.noResults') }}
                            </div>
                          </infinite-loading>
                        </div>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </template>
                <v-icon v-else class="mr-2">$telephoneInbound</v-icon>
              </div>

              <v-list-item-avatar>
                <v-avatar color="grey">
                  <v-icon dark> mdi-account-circle </v-icon>
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content class="d-flex flex-row">
                <v-list-item-title>{{
                  getDataAddressByKey(item.address, 'name')
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  getDataAddressByKey(item.address, 'numberPhone')
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content>
                <v-list-item-title>{{ item.createdAt }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-content>
                <v-list-item-title>{{
                  item.phoneTalkLogsDetail
                }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon>
                <v-icon> mdi-message </v-icon>
                <v-badge overlap :content="item.phoneTalkLogsLength"></v-badge>
              </v-list-item-icon>
            </v-list-item>

            <v-divider v-if="index < historys.length - 1" />
          </div>
        </ListContainer>
      </v-list-item-group>
    </v-list>

    <div v-if="isShowPagination" class="mt-4">
      <Pagination
        :total="total"
        :per-page="perPage"
        @page-changed="changePage($event)"
      />
    </div>
  </v-card>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { ApiStatus } from '@/store/constants';
import ListContainer from './commons/ListContainer.vue';
import Pagination from './commons/Pagination.vue';

export default {
  components: {
    ListContainer,
    Pagination,
  },

  props: {
    isToday: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: ApiStatus.IDLE,
    },

    historys: {
      type: Array,
      default() {
        return [];
      },
    },

    total: {
      type: Number,
      default: 1,
    },

    perPage: {
      type: Number,
      default: 1,
    },

    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState('phoneLog', ['users', 'usersPagination']),
    isShowPagination() {
      return Math.ceil(this.total / this.perPage) > 1;
    },
  },

  methods: {
    ...mapActions('phoneLog', ['getUsers']),
    changePage(page) {
      this.$emit('page-changed', page);
    },

    getDataAddressByKey(address, key) {
      if (!address) return '';
      return address[0][key] ?? '';
    },

    async getUserList() {
      this.loading = true;
      await this.getUsers({ page: 1 });
      this.loading = false;
    },

    getMoreUsers($state) {
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

<style scoped>
.header-list {
  background: rgba(0, 0, 0, 0.03);
  color: #373737 !important;
}
</style>
