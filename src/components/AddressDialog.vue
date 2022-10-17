<template>
  <div class="text-center">
    <v-dialog v-model="dialogAddress" width="500">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(handleSave)">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              {{
                $t(
                  isActionAdd
                    ? 'addressModal.phoneBookCreate'
                    : 'addressModal.phoneBookEditing'
                )
              }}
            </v-card-title>

            <v-card-text class="pt-3">
              <div class="form-group d-flex flex-column">
                <label>{{ $t('addressModal.phoneNumber') }}</label>
                <input
                  v-model="phoneAddress"
                  type="text"
                  class="form-control"
                  readonly
                  disabled
                />
              </div>

              <ValidationProvider
                v-slot="{ errors }"
                :name="$t('addressModal.name')"
                rules="required"
                mode="lazy"
              >
                <div class="form-group d-flex flex-column">
                  <label for="name">{{ $t('addressModal.name') }}</label>
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    class="form-control"
                    :placeholder="$t('addressModal.placeholderNameAddress')"
                  />
                  <span class="mes-error d-block">{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </v-card-text>
            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn color="error" text @click="dialogAddress = false">
                {{ $t('modal.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :disabled="status === apiStatus.LOADING"
                :loading="status === apiStatus.LOADING"
              >
                {{ $t(isActionAdd ? 'modal.save' : 'modal.update') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </ValidationObserver>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { ApiStatus } from '@/store/constants';
import addressService from '@/service/addressService';

export default {
  props: {
    openDialog: {
      type: Boolean,
      default: false,
    },
    phoneLog: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      name: this.phoneLog?.address?.name || '',
      apiStatus: ApiStatus,
      status: ApiStatus.IDLE,
    };
  },

  computed: {
    dialogAddress: {
      get() {
        return this.openDialog;
      },
      set(newValue) {
        this.$emit('toggle-dialog', newValue);
      },
    },

    isActionAdd() {
      return !this.phoneLog.address;
    },

    phoneAddress() {
      return this.phoneLog.customerPhoneNumberLocal;
    },
  },

  methods: {
    ...mapActions('address', ['createAddress']),

    async handleSave() {
      if (this.status === ApiStatus.LOADING) return;
      this.status = ApiStatus.LOADING;
      try {
        if (this.isActionAdd) {
          const body = {
            phoneNumber: this.phoneAddress,
            name: this.name,
          };
          await addressService.create(body);
          this.$toasted.success(this.$t('modal.createSuccess'));
        } else {
          await addressService.update(this.phoneAddress, {
            userPhoneNumberUpdate: this.phoneAddress,
            name: this.name,
          });
          this.$toasted.success(this.$t('modal.updateSuccess'));
        }
        this.$emit('reload');
      } catch (error) {
        this.$toasted.error(this.$t('error.undefined'));
      } finally {
        this.status = ApiStatus.IDLE;
      }

      this.dialogAddress = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-group {
  &:first-child {
    margin-bottom: 8px;
  }

  .form-control {
    border: 1px solid #adb5bd;
    border-radius: 4px;
    height: 42px;
    width: 100%;
    padding: 4px 8px;
    &:focus {
      outline: none !important;
      border: 1px solid #adb5bd;
      background-color: #ebf6fa;
    }
    &:disabled {
      color: rgba(0, 0, 0, 0.38);
      background-color: rgba(0, 0, 0, 0.06);
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
