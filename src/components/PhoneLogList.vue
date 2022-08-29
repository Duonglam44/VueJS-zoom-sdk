<template>
  <v-card class="mt-8 pb-4">
    <v-list subheader>
      <v-list-item-group>
        <v-subheader>{{ title }}</v-subheader>
        <template v-if="status === 'SUCCESS'">
          <v-list-item
            v-for="item in history"
            :key="item.name"
            @click.native="$emit('item-clicked', item.to)"
          >
            <v-list-item-action>
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-btn color="success" dark v-bind="attrs" v-on="on">
                    {{ $t('phoneLogs.onHold') }}
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title>{{
                      $t('phoneLogs.goOut')
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>{{
                      item.address[0].name
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
            <v-list-item-avatar>
              <v-avatar color="grey">
                <v-icon dark> mdi-account-circle </v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content class="d-flex flex-row">
              <v-list-item-title>{{ item.address[0].name }}</v-list-item-title>
              <v-list-item-subtitle>+84123456</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-title>{{ item.created_at }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title>{{ item.vtt }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon> mdi-message </v-icon>
              <v-badge overlap :content="item.vtt_length"></v-badge>
            </v-list-item-icon>
            <v-spacer></v-spacer>
            <v-list-item-icon>
              <v-icon> mdi-delete </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </template>
        <template v-if="status === 'LOADING'">
          <!--          display loading-->
        </template>
        <template v-if="status === 'ERROR'">
          <!--          display error-->
        </template>
      </v-list-item-group>
    </v-list>
    <div v-if="totalPage > 1" class="mt-4">
      <v-pagination
        v-model="page"
        :total-visible="7"
        :length="totalPage"
      ></v-pagination>
    </div>
  </v-card>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default() {
        return 'IDLE';
      },
    },
    totalPage: {
      type: Number,
      default() {
        return 1;
      },
    },
    history: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      required: true,
    },
    itemClicked: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    return {
      page: 1,
    };
  },
  watch: {
    page(p) {
      this.$emit('page-changed', p);
    },
  },
};
</script>
