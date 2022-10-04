<template>
  <v-dialog v-model="dialogModel" width="500" persistent>
    <v-sheet color="#fff" elevation="1" style="position: relative">
      <v-btn
        icon
        dark
        absolute
        class="float-right"
        style="top: 0; right: 0; z-index: 1"
        @click="dialogModel = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-tabs
        v-model="tab"
        background-color="#4caf50"
        centered
        slider-color="black"
        color="white"
      >
        <v-tab href="#tab-user">{{ $t('phoneLogs.extension') }}</v-tab>
        <v-tab href="#tab-adress">{{ $t('phoneLogs.outsideCall') }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-user">
          <UserList />
        </v-tab-item>
        <v-tab-item value="tab-adress">
          <AddressList />
          <ValidationObserver tag="form" @submit.prevent="onCall">
            <ValidationProvider rules="required">
              <div class="form-group d-flex">
                <input
                  id="phoneNumber"
                  v-model="phoneNumber"
                  type="text"
                  class="form-control"
                  required="true"
                />
                <v-btn
                  style="min-height: 38px"
                  color="success"
                  class="white--text btn-call"
                  :disabled="!phoneNumber || isInCalling"
                  type="submit"
                >
                  <v-icon left> mdi-phone-outgoing</v-icon>
                  {{ $t('phoneLogs.externalCall') }}
                </v-btn>
                <v-btn
                  style="min-height: 38px"
                  color="error"
                  class="white--text btn-call"
                  :disabled="!phoneNumber || isInCalling"
                  type="button"
                >
                  <v-icon left> mdi-phone-remove</v-icon>
                  {{ $t('phoneLogs.cutting') }}
                </v-btn>
              </div>
            </ValidationProvider>
          </ValidationObserver>
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>
  </v-dialog>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';

import { OUTGOING_CALL_TYPE } from '@/shared/constant/common';
import UserList from './UserList.vue';
import AddressList from './AddressList.vue';

export default {
  name: 'CallAwayDialog',

  components: {
    UserList,
    AddressList,
  },

  props: { openDialog: { type: Boolean, default: false } },

  data() {
    return {
      loading: false,
      tab: 'tab-user',
      selectedItem: 1,
      phoneNumber: '',
    };
  },

  computed: {
    ...mapGetters('twilio', ['isInCalling']),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),

    dialogModel: {
      get() {
        return this.openDialog;
      },
      set(newValue) {
        this.$emit('toggle-dialog', newValue);
      },
    },
  },

  methods: {
    ...mapActions('twilio', ['handleCall']),
    ...mapMutations('twilio', ['setIsShowCallTypeModal', 'setConnection']),

    onCall() {
      if (!this.phoneNumber || this.isInCalling) return;

      const params = {
        From: this.currentUser.phoneNumber,
        To: this.phoneNumber,
        call_type: OUTGOING_CALL_TYPE.SEND_OUTBOUND_CALL,
      };

      this.handleCall(params);
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-call {
  margin: 0 0 0 10px;
}
.form-group {
  &:first-child {
    padding: 10px;
  }

  .form-control {
    border: 1px solid #adb5bd;
    border-radius: 4px;
    height: 38px;
    width: 100%;
    padding: 4px 8px;
    &:focus {
      outline: none !important;
      border: 1px solid #adb5bd;
      background-color: #ebf6fa;
    }
  }
}

.btn-login {
  margin-top: 4px;
}

.mes-error {
  color: red;
  font-size: 14px;
}
</style>
