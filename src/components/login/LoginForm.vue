<template>
  <div class="card mx-auto my-auto form-signin" style="width: 30rem">
    <img class="card-img-top" src="@/assets/DXP_logo.png" alt="" />
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onLogin)">
        <template v-if="errorLogin">
          <p class="mes-error">
            {{
              $t(
                errorLogin.status === httpStatus.BAD_REQUEST
                  ? 'login.wrongLogin'
                  : 'error.undefined'
              )
            }}
          </p>
        </template>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('login.email')"
          rules="required|email"
          mode="lazy"
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
            <span class="mes-error d-block">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('login.password')"
          rules="required|min:8"
          mode="lazy"
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
            <span class="mes-error d-block">{{ errors[0] }}</span>
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

export default {
  data() {
    return {
      email: '',
      password: '',
      errorLogin: null,
      httpStatus: HTTP_STATUS,
    };
  },

  computed: {
    ...mapState('auth', ['isLoading']),
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

  .btn-login {
    margin-top: 4px;
  }

  .mes-error {
    color: red;
    font-size: 14px;
  }
}
</style>
