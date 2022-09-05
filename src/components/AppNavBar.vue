<template>
  <v-app-bar
    fixed
    color="#505c65"
    scroll-target="#scrolling-techniques-7"
    height="60"
  >
    <img src="../assets/logo-icon.png" alt="Logo" class="ma-1 pa-1" />
    <router-link to="/">
      <v-toolbar-title class="white--text font-weight-black ma-2 pa-1">
        {{ $t('headerBar.phoneLogs') }}
      </v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>
    <v-menu left offset-y>
      <template #activator="{ on, attrs }">
        <v-btn text v-bind="attrs" class="white--text" v-on="on">
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
        <v-list-item link>
          <v-list-item-title>
            {{ $t('headerBar.logoutLink') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AppNavBar',
  computed: {
    ...mapState('auth', ['user']),
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
