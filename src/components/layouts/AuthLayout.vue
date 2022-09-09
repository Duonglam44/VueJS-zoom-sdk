<template>
  <div>
    <AppNavBar />

    <v-container>
      <router-view />
    </v-container>
    <CallTypeModal />
  </div>
</template>

<script>
import AppNavBar from '@/components/AppNavBar.vue';
import CallTypeModal from '@/components/CallTypeModal.vue';

export default {
  name: 'AuthLayout',

  components: {
    AppNavBar,
    CallTypeModal,
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
