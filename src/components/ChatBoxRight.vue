<template>
  <div class="balloon_r">
    <div class="d-flex flex-column mt-10">
      <v-icon v-if="tag && tag.tag1" color="#ff7d7d">mdi-bookmark</v-icon>
    </div>
    <div class="face_icon text-center">
      <v-avatar color="red">
        <span class="white--text">
          {{ user.shortName || user.name | avatar }}
        </span>
      </v-avatar>
      <p class="text-center">{{ user.shortName || user.name }}</p>
    </div>
    <div>
      <div class="d-flex">
        <v-btn
          v-if="showReplay"
          :disabled="!fileToBuffer || playing"
          icon
          small
          @click="playAudioSource"
        >
          <v-icon>{{
            playing
              ? 'mdi-stop-circle-outline'
              : 'mdi-arrow-right-drop-circle-outline'
          }}</v-icon>
        </v-btn>
        <v-btn
          small
          :class="{ 'v-btn--active': tag && tag.tag1 }"
          elevation="0"
          @click="onToggleTag"
        >
          <v-icon color="#ff7d7d">mdi-bookmark</v-icon>
        </v-btn>
      </div>
      <p class="says">
        {{ chat.text || chat.vtt }}
      </p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

import systemMixins from '@/mixins/system';

import { playAudio } from '@/shared/utils';

export default {
  name: 'ChatBoxRight',

  mixins: [systemMixins],

  props: {
    tag: {
      type: Object,
      default() {
        return {};
      },
    },
    user: {
      type: Object,
      default() {
        return {};
      },
    },
    chat: {
      type: Object,
      default() {
        return {};
      },
    },
    showReplay: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tags: null,
      playing: false,
    };
  },

  computed: {
    ...mapState('phoneLog', ['fileToBuffer']),
  },

  methods: {
    async playAudioSource() {
      try {
        this.playing = true;
        await playAudio({
          start: this.chat.startTime,
          end: this.chat.endTime,
          buffer: this.fileToBuffer,
        });
      } finally {
        this.playing = false;
      }
    },

    onToggleTag() {
      this.$emit('update', { tag1: !this.tag?.tag1 });
    },
  },
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
.face_icon {
  max-width: 100px;
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
  background: #cbfdff;
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
  border-right: 22px solid #cbfdff;
}
.balloon_r .says:after {
  right: -26px;
  border-left: 22px solid #cbfdff;
}
</style>
