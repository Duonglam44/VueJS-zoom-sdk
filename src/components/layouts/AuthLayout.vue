<template>
  <div>
    <AppNavBar />

    <v-container>
      <router-view />
    </v-container>
  </div>
</template>

<script>
import AppNavBar from '@/components/AppNavBar.vue';

export default {
  name: 'AuthLayout',
  components: {
    AppNavBar,
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
