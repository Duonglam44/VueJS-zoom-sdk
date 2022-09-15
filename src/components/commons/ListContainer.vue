<template>
  <div>
    <template v-if="status === apiStatus.LOADING">
      <v-skeleton-loader class="mx-auto" type="article" />
    </template>

    <template v-if="status === apiStatus.SUCCESS">
      <template v-if="isData">
        <slot />
      </template>

      <template v-else>
        <EmptyData />
      </template>
    </template>

    <template v-if="status === apiStatus.ERROR">
      <!--display error-->
    </template>
  </div>
</template>

<script>
import { ApiStatus } from '@/store/constants';
import EmptyData from './EmptyData.vue';

export default {
  components: {
    EmptyData,
  },
  props: {
    isData: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: ApiStatus.IDLE,
    },
  },
  data() {
    return {
      apiStatus: ApiStatus,
    };
  },
};
</script>
