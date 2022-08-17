<template>
  <v-bottom-sheet v-model="caller" height="200" width="200">
    <v-sheet color="#212936" elevation="1" height="200" width="200">
      <v-row class="d-flex justify-center">
        <v-col cols="12">
          <v-list color="#212936" dark>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ user }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col cols="6">
          <v-btn
            elevation="2"
            fab
            small
            color="red darken-4"
            class="d-flex justify-center ma-auto"
            @click="caller = false"
            ><v-icon color="white">mdi-phone-hangup</v-icon></v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn
            elevation="2"
            fab
            small
            color="green accent-3"
            class="d-flex justify-center ma-auto"
            to="/phone_call"
            ><v-icon color="white">mdi-phone</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script>
export default {
  name: 'CallingDialog',
  data() {
    return {
      timerId: null,
      tags: null,
      user: null,
      caller: null,
    };
  },
  mounted() {
    this.timerId = setTimeout(() => {
      this.caller = true;
      clearTimeout(this.timerId);
    }, 5000);
  },
};
</script>
