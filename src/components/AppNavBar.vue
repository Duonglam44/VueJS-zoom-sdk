<template>
  <v-app-bar
    fixed
    color="#505c65"
    scroll-target="#scrolling-techniques-7"
    height="60"
  >
    <img src="../assets/logo-icon.png" alt="Logo" class="ma-1 pa-1" />
    <span class="link-item" @click="goBackHomePage">
      <v-toolbar-title class="white--text font-weight-black ma-2 pa-1">
        {{ $t('headerBar.phoneLogs') }}
      </v-toolbar-title>
    </span>
    <v-spacer></v-spacer>
    <v-menu v-if="user" left offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          class="white--text"
          :loading="loading"
          v-on="on"
        >
          <span>{{ user.name }}</span>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item link>
          <router-link to="/profile">
            <v-list-item-title class="black--text">
              {{ $t('headerBar.profileLink') }}
            </v-list-item-title>
          </router-link>
        </v-list-item>
        <v-list-item @click="handleLogout">
          <v-list-item-title>
            {{ $t('headerBar.logoutLink') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AppNavBar',

  data() {
    return { loading: false };
  },

  computed: {
    ...mapState('auth', ['user']),
  },

  methods: {
    ...mapActions('auth', ['logout']),

    goBackHomePage() {
      this.$router.push(
        '/',
        () => {
          // to do
        },
        () => {
          window.location.reload();
        }
      );
    },

    async handleLogout() {
      try {
        this.loading = true;
        await this.logout();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.link-item {
  cursor: pointer;
}
</style>
