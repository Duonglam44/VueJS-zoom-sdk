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
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavBar',
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
