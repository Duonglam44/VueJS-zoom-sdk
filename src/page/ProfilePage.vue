<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <AppNavBar />
      </v-col>
    </v-row>
    <div class="mt-13">
      <span> profile page</span>
    </div>
  </v-container>
</template>

<script>
import AppNavBar from '@/components/AppNavBar.vue';

export default {
  name: 'ProfilePage',
  components: {
    AppNavBar,
  },
};
</script>
