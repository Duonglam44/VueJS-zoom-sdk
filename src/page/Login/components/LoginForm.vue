<template>
  <div class="card mx-auto my-auto form-signin" style="width: 30rem">
    <img
      class="card-img-top"
      src="@/assets/DXP_logo.png"
      alt="logo"
      width="300"
      height="300"
    />
    <SelectTennant v-if="isElectron" />
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onLogin)">
        <template v-if="errorLogin">
          <p class="error-message">
            {{ errorMessage }}
          </p>
        </template>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('login.email')"
          rules="required|email"
          mode="lazy"
          slim
          class="mb-2"
        >
          <div class="form-group d-flex flex-column">
            <label for="inputEmail">{{ $t('login.email') }}</label>
            <input
              id="inputEmail"
              v-model="email"
              type="email"
              class="form-control"
              :placeholder="$t('login.emailPlaceholder')"
            />
            <span class="error-message d-block">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('login.password')"
          rules="required|min:8"
          mode="lazy"
          slim
          class="mb-3"
        >
          <div class="form-group d-flex flex-column">
            <label for="password">{{ $t('login.password') }}</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              :placeholder="$t('login.passwordPlaceholder')"
            />
            <span class="error-message d-block">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <v-btn
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          class="btn-login"
          depressed
          color="primary"
        >
          {{ $t('login.btnSubmit') }}
        </v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { HTTP_STATUS } from '@/shared/constant/common';
import { isElectron } from '@/shared/utils';

import SelectTennant from './SelectTennant.vue';

export default {
  components: {
    SelectTennant,
  },

  data() {
    return {
      email: '',
      password: '',
      errorLogin: null,
    };
  },

  computed: {
    ...mapState('auth', ['isLoading']),

    isElectron() {
      return isElectron();
    },

    errorMessage() {
      const localePath = [
        HTTP_STATUS.FORBIDDEN,
        HTTP_STATUS.BAD_REQUEST,
      ].includes(this.errorLogin.status)
        ? 'login.wrongLogin'
        : 'error.undefined';

      return this.$t(localePath);
    },
  },

  methods: {
    ...mapActions('auth', ['login']),
    onLogin() {
      const user = { email: this.email, password: this.password };
      this.login(user).catch((err) => {
        this.errorLogin = err;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;

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
    }
  }

  .error-message {
    color: red;
    font-size: 14px;
  }
}
</style>
