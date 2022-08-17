<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-app-bar
          fixed
          color="#505c65"
          scroll-target="#scrolling-techniques-7"
        >
          <v-btn to="/" text x-large color="#505c65" class="white--text">
            ＜戻る
          </v-btn>
          <v-toolbar-title class="white--text font-weight-black"
            >お客様名</v-toolbar-title
          >

          <v-spacer></v-spacer>
          <v-btn elevation="2" icon outlined color="white" class="mx-1" disabled
            ><v-icon>mdi-phone-settings</v-icon></v-btn
          >
          <v-btn elevation="2" icon outlined color="white" class="mx-1" disabled
            ><v-icon>mdi-microphone</v-icon></v-btn
          >

          <v-btn elevation="2" color="#22d65e" class="white--text mx-3"
            ><v-icon>mdi-phone-hangup</v-icon>発信</v-btn
          >
        </v-app-bar>
      </v-col>
    </v-row>
    <v-row style="height: 90vh">
      <v-col cols="8" class="pt-15">
        <v-row>
          <v-col cols="4" class="d-flex justify-start pt-1">
            <v-btn to="/phone_log?date=2022-02-01" text x-large color="#505c65">
              ＜前の通話
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="4" class="d-flex justify-center pt-1">
            <v-subheader class="font-weight-black text-h6 mx-auto">{{
              date
            }}</v-subheader>
          </v-col>
          <v-col cols="4" class="d-flex justify-end pt-1">
            <v-btn to="/phone_log?date=2022-02-01" text x-large color="#505c65">
              次の通話＞
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-15">
            <div v-for="item in phone_log.vtt" :key="item.user">
              <div v-if="item.user === 'operator_user'">
                <ChatBoxRight :user="phone_log.operator_user" :chat="item" />
              </div>
              <div v-if="item.user === 'customer_user'">
                <ChatBoxLeft
                  :user="phone_log.customer_user"
                  :chat="item"
                  :tag="item.meta"
                />
              </div>
            </div>
          </v-col>
          <v-footer fixed width="65vw" color="#bbbbbb">
            <v-row>
              <v-col cols="3">
                <v-btn text x-large color="#505c65" class="white--text">
                  <v-icon>mdi-pencil</v-icon>MEMO
                </v-btn>
              </v-col>
              <v-col cols="9">
                <v-textarea
                  outlined
                  rows="3"
                  row-height="25"
                  background-color="#ffffff"
                  class="rounded-lg"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-footer>
        </v-row>
      </v-col>
      <v-divider inset vertical></v-divider>
      <v-col cols="4" class="pt-15">
        <v-subheader class="font-weight-black text-h6">保存リスト</v-subheader>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>

          <v-tab class="rounded-t-xl" style="background-color: #f9f9f9"
            >すべて<v-badge
              v-if="tag_all_list && tag_all_list.length > 0"
              inline
              :content="tag_all_list.length"
            ></v-badge
          ></v-tab>
          <v-tab
            class="rounded-t-xl white--text"
            style="background-color: #ff7d7d"
            >営業連絡<v-badge
              v-if="tag_1_list && tag_1_list.length > 0"
              inline
              :content="tag_1_list.length"
            ></v-badge
          ></v-tab>
          <v-tab
            class="rounded-t-xl white--text"
            style="background-color: #ffc421"
            >注文<v-badge
              v-if="tag_2_list && tag_2_list.length > 0"
              inline
              :content="tag_2_list.length"
            ></v-badge
          ></v-tab>
          <v-tab-item style="background-color: #f9f9f9">
            <v-sheet block height="5" color="#f9f9f9" class="mr-1"> </v-sheet>
            <div v-for="item in tag_all_list" :key="item.user">
              <v-card elevation="2" class="ma-1 pa-1">
                <div v-if="item.user === 'operator_user'">
                  <MemoList
                    :user="phone_log.operator_user"
                    :chat="item"
                    :meta="item.meta"
                  />
                </div>
                <div v-if="item.user === 'customer_user'">
                  <MemoList
                    :user="phone_log.customer_user"
                    :chat="item"
                    :meta="item.meta"
                  />
                </div>
              </v-card>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-sheet block height="5" color="#ff7d7d" class="mr-1"> </v-sheet>
            <div v-for="item in tag_1_list" :key="item.user">
              <v-card elevation="2" class="ma-1 pa-1">
                <div v-if="item.user === 'operator_user'">
                  <MemoList
                    :user="phone_log.operator_user"
                    :chat="item"
                    :meta="item.meta"
                  />
                </div>
                <div v-if="item.user === 'customer_user'">
                  <MemoList
                    :user="phone_log.customer_user"
                    :chat="item"
                    :meta="item.meta"
                  />
                </div>
              </v-card>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-sheet block height="5" color="#ffc421" class="mr-1"> </v-sheet>
            <div v-for="item in tag_2_list" :key="item.user">
              <v-card elevation="2" class="ma-1 pa-1">
                <div v-if="item.user === 'operator_user'">
                  <MemoList
                    :user="phone_log.operator_user"
                    :chat="item"
                    :meta="item.meta"
                  />
                </div>
                <div v-if="item.user === 'customer_user'">
                  <MemoList
                    :user="phone_log.customer_user"
                    :chat="item"
                    :meta="item.meta"
                  />
                </div>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChatBoxRight from '@/components/ChatBoxRight.vue';
import ChatBoxLeft from '@/components/ChatBoxLeft.vue';
import MemoList from '@/components/MemoList.vue';

export default {
  name: 'PhoneLogPage',

  components: {
    ChatBoxRight,
    ChatBoxLeft,
    MemoList,
  },
  data() {
    return {
      date: null,
      phone_log: null,
      tag_1_list: [],
      tag_2_list: [],
      tag_all_list: [],
    };
  },
  created() {
    this.date = this.$route.query.date;
    fetch(`/test_data/phone-log_${this.date}.json`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        [this.phone_log] = data;
        this.tag_all_list = this.phone_log.vtt.filter((item) => {
          return item.meta.includes(0) || item.meta.includes(1);
        });
        this.tag_1_list = this.phone_log.vtt.filter((item) => {
          return item.meta.includes(0);
        });
        this.tag_2_list = this.phone_log.vtt.filter((item) => {
          return item.meta.includes(1);
        });
      });
  },
};
</script>
