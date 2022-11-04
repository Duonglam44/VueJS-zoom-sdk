<template>
  <div>
    <div class="login-wrapper">
      <LoginForm />
    </div>
    <v-footer :padless="true">
      <v-card flat tile width="100%" class="card-footer text-start">
        <v-card-text class="black--text d-flex align-center">
          <v-icon>$copyright</v-icon>
          <span>{{ new Date().getFullYear() }}</span>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: { LoginForm },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  min-height: calc(100vh - 54px);
}

.card-footer {
  background: rgb(232, 232, 232) !important;
}
</style>
