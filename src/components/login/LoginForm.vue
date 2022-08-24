<template>
  <div class="card mx-auto my-auto form-signin" style="width: 30rem">
    <img class="card-img-top" src="@/assets/DXP_logo.png" alt="" />
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onLogin)">
        <p :v-show="!!errorsLogin" class="mes-error">
          {{ errorsLogin.error }}
        </p>
        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('login.email')"
          rules="required|email"
        >
          <div class="form-group d-flex flex-column">
            <label for="inputEmail">{{ $t('login.email') }}</label>
            <input
              id="inputEmail"
              v-model="email"
              type="email"
              class="form-control"
              :placeholder="$t('login.email_placeholder')"
              required="true"
            />
            <span class="mes-error d-block">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('login.password')"
          rules="required|min:8"
        >
          <div class="form-group d-flex flex-column">
            <label for="password">{{ $t('login.password') }}</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              :placeholder="$t('login.password_placeholder')"
              required="true"
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
          {{ $t('login.btn_submit') }}
        </v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },

  computed: {
    ...mapState('auth', ['errorsLogin', 'isLoading']),
  },

  methods: {
    ...mapActions('auth', ['login']),

    onLogin() {
      const user = { email: this.email, password: this.password };
      this.login(user);
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
