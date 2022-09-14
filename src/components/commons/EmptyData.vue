<template>
  <div class="not-found-container d-flex flex-column">
    <v-icon x-large color="rgb(163 163 163)"> mdi-folder-open </v-icon>
    <div class="message">{{ message || $t('notFound.noData') }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyData',
  props: {
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.not-found-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;

  .message {
    color: #c3c3c3;
  }
}
</style>
