<template>
  <v-pagination
    v-model="page"
    :total-visible="7"
    :length="totalPage"
  ></v-pagination>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      page: 1,
    };
  },

  computed: {
    totalPage() {
      return Math.ceil(this.total / this.perPage);
    },
  },

  watch: {
    page(p) {
      this.$emit('page-changed', p);
    },
  },
};
</script>
