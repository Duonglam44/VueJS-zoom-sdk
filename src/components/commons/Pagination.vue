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
    pageSelected: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    totalPage() {
      return Math.ceil(this.total / this.perPage);
    },

    page: {
      get() {
        return this.pageSelected;
      },
      set(newPage) {
        this.$emit('page-changed', newPage);
      },
    },
  },
};
</script>
