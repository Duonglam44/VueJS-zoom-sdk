<template>
  <v-card class="mt-8 pb-4">
    <v-list subheader>
      <v-list-item-group>
        <v-subheader class="font-weight-bold header-list">{{
          title
        }}</v-subheader>
        <ListContainer :status="status" :is-data="!!historyList.length">
          <div v-for="(item, index) in historyList" :key="item.phoneLogId">
            <v-list-item @click.native="$emit('item-clicked', item.phoneLogId)">
              <div>
                <template v-if="allowShowBtnOnhold && !!item.onhold">
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
                          <v-list-item-title @click="returnCall">{{
                            $t('phoneLogs.goOut')
                          }}</v-list-item-title>
                        </v-list-item>

                        <div>
                          <v-list-item v-for="user in users" :key="user.userId">
                            <v-list-item-title @click="selectOnHoldUser(user)">
                              {{ user.name }}
                            </v-list-item-title>
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

              <v-list-item-content class="ml-2">
                <v-list-item-title>
                  <span>{{ getDataAddressByKey(item.address, 'name') }} </span>
                  <span>
                    <v-list-item-action>
                      <v-menu
                        bottom
                        origin="center center"
                        transition="scale-transition"
                      >
                        <template #activator="{ on, attrs }">
                          <v-btn
                            v-if="!item.address || !item.address.name"
                            color="success"
                            class="ml-2"
                            small
                            v-bind="attrs"
                            v-on="on"
                            @click.prevent="showPopupAddress(item)"
                          >
                            <v-icon small> mdi-plus </v-icon>
                          </v-btn>

                          <v-btn
                            v-if="item.address && item.address.name"
                            class="ml-2"
                            small
                            v-bind="attrs"
                            v-on="on"
                            @click.prevent="showPopupAddress(item)"
                          >
                            <v-icon small> mdi-pencil </v-icon>
                          </v-btn>
                        </template>
                      </v-menu>
                    </v-list-item-action>
                  </span>
                </v-list-item-title>

                <v-list-item-subtitle>{{
                  item.customerPhoneNumberLocal
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

            <v-divider v-if="index < historyList.length - 1" />
          </div>
        </ListContainer>
      </v-list-item-group>
    </v-list>

    <div v-if="isShowPagination" class="mt-4">
      <Pagination
        :total="total"
        :per-page="perPage"
        :page-selected="pageSelected"
        @page-changed="changePage($event)"
      />
    </div>
    <AddressDialog
      v-if="isShowModalAdress"
      :open-dialog="isShowModalAdress"
      :phone-log="phoneLog"
      @toggle-dialog="isShowModalAdress = $event"
      @reload="$emit('reload-data')"
    />
  </v-card>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import { ApiStatus } from '@/store/constants';
import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';

import ListContainer from './commons/ListContainer.vue';
import Pagination from './commons/Pagination.vue';
import AddressDialog from './AddressDialog.vue';

export default {
  components: {
    ListContainer,
    Pagination,
    AddressDialog,
  },

  props: {
    allowShowBtnOnhold: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: ApiStatus.IDLE,
    },

    historyList: {
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

    pageSelected: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      loading: false,
      isShowModalAdress: false,
      phoneLog: null,
    };
  },

  computed: {
    ...mapState('phoneLog', ['users', 'usersPagination']),
    ...mapState('twilio', ['holdingCallSid', 'device']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),

    isShowPagination() {
      return Math.ceil(this.total / this.perPage) > 1;
    },
  },

  methods: {
    ...mapActions('phoneLog', ['getUsers']),
    ...mapActions('twilio', ['handleCall', 'returnCall']),
    ...mapMutations('twilio', ['setConnection']),

    changePage(page) {
      this.$emit('page-changed', page);
    },

    showPopupAddress(data) {
      this.phoneLog = data;
      this.isShowModalAdress = true;
    },

    getDataAddressByKey(address, key) {
      if (!address) return 'null';
      return address[key] ?? '';
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

    selectOnHoldUser(user) {
      try {
        if (!this.holdingCallSid) throw Error(`holdingCallSid is required`);

        const params = {
          From: this.currentUser.phoneNumber,
          To: user.phoneNumber,
          call_type: OUTGOING_CALL_TYPE.ONHOLD_INBOUND,
          user_id: user.userId,
          caller_id: this.holdingCallSid,
        };

        this.handleCall(params);
      } catch (error) {
        console.log('selectOnHoldUser -> error', error);
      }
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
