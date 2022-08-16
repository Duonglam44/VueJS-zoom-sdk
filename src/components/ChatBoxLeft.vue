<template>
  <div class="balloon_l">
    <div class="face_icon">
      <v-avatar color="blue">
        <span class="white--text">
          {{ user.short_name }}
        </span>
      </v-avatar>
    </div>
    <div>
      <v-btn-toggle
        v-model="inputedValue"
        multiple
        dense
        class="d-flex justify-end"
      >
        <v-btn small>
          <v-icon color="#ffc421">mdi-label</v-icon>
        </v-btn>
        <v-btn small>
          <v-icon color="#ff7d7d">mdi-label</v-icon>
        </v-btn>
      </v-btn-toggle>
      <p class="says">
        {{ chat.text }}
      </p>
    </div>
    <div class="d-flex flex-column mt-10">
      <v-icon v-if="tag && tag.includes(0)" color="#ffc421">mdi-label</v-icon>
      <v-icon v-if="tag && tag.includes(1)" color="#ff7d7d">mdi-label</v-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ChatBoxLeft',
  props: ['tag', 'chat', 'user'],
  data() {
    return {
      tags: null,
    };
  },
  computed: {
    inputedValue: {
      get() {
        return this.tag;
      },
      set(newValue) {
        this.$emit('update', newValue);
      },
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
</style>
