<template>
  <div class="text-center">
    <v-overlay :value="loading" opacity="0.8" z-index="10">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
export default {
  name: 'Loading',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
