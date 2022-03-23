<template>
  
  <div class="balloon_l">
    <div class="face_icon">
      <v-avatar color="blue">
        <span class="white--text">
          {{user.name}}
        </span>
      </v-avatar>
    </div>
    <div>
      <v-btn-toggle
        v-model="tags"
        rounded
        dense
      >
        <v-btn small>
          <v-icon color="#ffc421">mdi-label</v-icon>
        </v-btn>
        <v-btn small>
          <v-icon color="#ff7d7d">mdi-label</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-badge
            v-if="tags == 0"
            bordered
            color="#ffc421"
            icon="mdi-label"
            overlap
          >
      </v-badge>
      <v-badge
            v-if="tags == 1"
            bordered
            color="#ff7d7d"
            icon="mdi-label"
            overlap
          >
      </v-badge>
      <p class="says">
        {{chat.text}}
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChatBoxLeft',
    props:['tag','chat','user'],
    mounted:function(){
    },
    data () {
      return {
        tags:undefined,
      }
    },
    methods: {
    }
  }
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
  background: #8ee7b6;
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
  content: "";
  position: absolute;
  border: 10px solid transparent;
  margin-top: -3px;
}
.balloon_l .says:after {
  left: -26px;
  border-right: 22px solid #8ee7b6;
}
.balloon_r .says:after {
  right: -26px;
  border-left: 22px solid #8ee7b6;
}
</style>