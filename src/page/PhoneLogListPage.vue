<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-app-bar
          fixed
          color="#505c65"
          scroll-target="#scrolling-techniques-7"
          height="60"
        >
          <img src="../assets/logo-icon.png" alt="Logo" class="ma-1 pa-1">

          <v-toolbar-title class="white--text font-weight-black ma-2 pa-1">通話履歴</v-toolbar-title>
    
          <v-spacer></v-spacer>
          <v-text-field
              prepend-inner-icon="mdi-magnify"
              placeholder="検索キーワード"
              solo
              rounded
              dense
              class="my-auto pa-1"
            ></v-text-field>
          <v-spacer></v-spacer>
        </v-app-bar>
      </v-col>
    </v-row>
    <v-row class="mt-13">
      <v-col cols="5" class="d-flex">
        <v-btn icon><v-icon>mdi-arrow-left-thick</v-icon></v-btn>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              solo
              prepend-inner-icon="mdi-calendar"
              readonly
              rounded
              dense
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            type="month"
            scrollable
            locale="ja-JP"
            color="#505c65"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog.save(date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-btn icon><v-icon>mdi-arrow-right-thick</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-list subheader>
          <v-list-item-group>
            <v-subheader>今日</v-subheader>
            <v-list-item v-for="item in call_logs" :key="item.name" :to="item.to">
              <v-list-item-avatar>
                <v-img
                  :src="item.avator"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{item.name}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>{{item.log_date}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>{{item.log_note}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon >
                  mdi-message
                </v-icon>
                <v-badge
                  overlap
                  :content="item.vtt_length"
                ></v-badge>
              </v-list-item-icon>
              <v-spacer></v-spacer>
              <v-list-item-icon>
                <v-icon >
                  mdi-delete
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PhoneLogListPage',
    components: {
    },
    data () {
      return {
        modal: false,
        date: new Date().toISOString().substr(0, 7),
        call_logs:[
          {
            avator:"https://cdn.vuetifyjs.com/images/lists/1.jpg",
            name:"客A",
            log_date:"14:00",
            log_note:"メモ：AAA　あとB",
            vtt:[],
            vtt_length:8,
            to:"/phone_call"
          },
          {
            avator:"https://cdn.vuetifyjs.com/images/lists/1.jpg",
            name:"客A",
            log_date:"14:00",
            log_note:"メモ：AAA　あとB",
            vtt:[],
            vtt_length:8,
            to:"/phone_log?date=2022-03-01"
          },
          {
            avator:"https://cdn.vuetifyjs.com/images/lists/1.jpg",
            name:"客A",
            log_date:"14:00",
            log_note:"メモ：AAA　あとB",
            vtt:[],
            vtt_length:8,
            to:"/phone_call"
          },
          {
            avator:"https://cdn.vuetifyjs.com/images/lists/1.jpg",
            name:"客A",
            log_date:"14:00",
            log_note:"メモ：AAA　あとB",
            vtt:[],
            vtt_length:8,
            to:"/phone_log?date=2022-03-01"
          },
          {
            avator:"https://cdn.vuetifyjs.com/images/lists/1.jpg",
            name:"客A",
            log_date:"14:00",
            log_note:"メモ：AAA　あとB",
            vtt:[],
            vtt_length:8,
            to:"/phone_log?date=2022-03-01"
          }
        ]
      }
    },
  }
</script>
