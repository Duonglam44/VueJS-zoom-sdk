<template>
  <div class="balloon_l">
    <v-sheet
      v-if="meta && meta.tag1"
      width="5"
      height="50"
      color="#ffc421"
      class="mr-1"
    >
    </v-sheet>
    <v-sheet
      v-if="meta && meta.tag2"
      width="5"
      height="50"
      color="#ff7d7d"
      class="mr-1"
    >
    </v-sheet>
    <div class="face_icon">
      <v-avatar color="blue">
        <span class="white--text">
          {{ user.shortName || user.name | avatar }}
        </span>
      </v-avatar>
    </div>
    <div>
      <p class="says">
        {{ chat.text || chat.vtt }}
      </p>
    </div>
  </div>
</template>
<script>
import systemMixins from '@/mixins/system';

export default {
  name: 'MemoList',

  mixins: [systemMixins],

  props: {
    meta: {
      type: Object,
      default: () => ({}),
    },
    chat: {
      type: Object,
      default: () => ({}),
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped>
.balloon_l,
.balloon_r {
  margin: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.balloon_r {
  justify-content: flex-end;
}

.face_icon img {
  width: 80px;
  height: auto;
}

.balloon_r .face_icon {
  margin-left: 25px;
}

.balloon_l .face_icon {
  margin-right: 25px;
}

.balloon_r .face_icon {
  order: 2 !important;
}

.says {
  max-width: 300px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 10px;
  border-radius: 12px;
  background: #f2f2f2;
  box-sizing: border-box;
  margin: 0 !important;
  line-height: 1.5;
  /*   align-items: center; */
}

.says p {
  margin: 8px 0 0 !important;
}

.says p:first-child {
  margin-top: 0 !important;
}

.says:after {
  content: '';
  position: absolute;
  border: 10px solid transparent;
  margin-top: -3px;
}

.balloon_l .says:after {
  left: -26px;
  border-right: 22px solid #f2f2f2;
}

.balloon_r .says:after {
  right: -26px;
  border-left: 22px solid #f2f2f2;
}

.says2 {
  max-width: 300px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 10px;
  border-radius: 12px;
  background: #cbfdff;
  box-sizing: border-box;
  margin: 0 !important;
  line-height: 1.5;
  /*   align-items: center; */
}

.says2 p {
  margin: 8px 0 0 !important;
}

.says2 p:first-child {
  margin-top: 0 !important;
}

.says2:after {
  content: '';
  position: absolute;
  border: 10px solid transparent;
  margin-top: -3px;
}

.balloon_l .says2:after {
  left: -26px;
  border-right: 22px solid #cbfdff;
}

.balloon_r .says2:after {
  right: -26px;
  border-left: 22px solid #cbfdff;
}
</style>
