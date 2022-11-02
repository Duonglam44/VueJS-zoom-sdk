<template>
  <v-dialog
    v-model="isShowIncomingCallDialog"
    width="350"
    content-class="incoming-call-dialog"
    persistent
  >
    <div
      class="main-content flex flex-column items-center justify-center wrapper-caller-info"
      style="min-height: 100%"
    >
      <section
        class="caller-info flex flex-column items-center flex-auto justify-center"
      >
        <div class="circle avatar-caller mb4">
          <div class="ripple-wave">
            <div class="ripple-wave-2"></div>
          </div>
          <!-- <div class="material-icons circle icon-phone">phone_callback</div> -->
          <v-icon circle class="icon-phone"> mdi-phone-incoming </v-icon>
        </div>
        <h1 id="title" class="mb2">{{ title }}</h1>
      </section>
      <section class="call-buttons flex justify-between">
        <div class="btn-floating-label">
          <a
            id="reject"
            class="btn-floating btn-jumbo waves-effect waves-light danger"
            @click="callRejectHandler"
          >
            <v-icon> mdi-phone </v-icon>
          </a>
          <h4 for="reject">{{ $t('callTypeModal.cancel') }}</h4>
        </div>
        <div class="btn-floating-label">
          <a
            id="accept"
            class="btn-floating btn-jumbo waves-effect waves-light success"
            @click="acceptCall"
          >
            <v-icon> mdi-phone </v-icon>
          </a>
          <h4 for="accept">{{ $t('callTypeModal.reply') }}</h4>
        </div>
      </section>
    </div>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import { formatNumber } from '@/shared/utils';

export default {
  name: 'IncomingCallDialog',

  data() {
    return {};
  },

  computed: {
    ...mapState('twilio', ['connection', 'isShowIncomingCallDialog']),
    ...mapGetters('twilio', ['callType']),

    title() {
      const from = this.connection?.parameters?.From ?? '';
      if (!from) return '';

      return formatNumber(from);
    },
  },

  methods: {
    ...mapActions('twilio', ['acceptCall', 'callRejectHandler']),
  },
};
</script>

<style>
.incoming-call-dialog {
  border-radius: 1rem;
}
</style>

<style scoped>
.main-content {
  background-color: #1393bd;
  color: white;
  padding: 1.2rem;
  border-radius: 1rem;
}
.flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.flex-auto {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}
#title {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0 0 1em;
  line-height: 3rem;
  margin-bottom: 1rem;
}
.danger {
  background-color: #f65959;
}
.success {
  background-color: #99d154;
}
.caller-info {
  min-height: 100px;
}
.caller-info .avatar-caller {
  width: 65px;
  height: 65px;
}
.caller-info .avatar-caller .icon-phone {
  position: absolute;
  z-index: 2;
  width: inherit;
  height: inherit;
  font-size: 2.5rem;
  color: #1393bd;
}
.call-buttons {
  width: 250px;
}

.call-buttons .btn-floating-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.call-buttons .btn-floating-label .btn-floating.btn-jumbo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
.call-buttons .btn-floating-label .btn-floating.btn-jumbo i {
  font-size: 1.5rem;
  line-height: 5rem;
  color: white;
}
.call-buttons .btn-floating-label h4 {
  font-weight: 300;
  text-align: center;
  font-size: 1rem;
  margin-top: 0.5rem;
}
#reject i {
  transform: rotate(135deg);
}
.ripple-wave {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  height: 65px;
  width: 65px;
}
.ripple-wave::before,
.ripple-wave::after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: white;
  will-change: transform, opacity;
}
.ripple-wave::after {
  -webkit-animation: pulse-animation 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  animation: pulse-animation 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  transition: opacity 0.4s, transform 0.4s;
}
.ripple-wave .ripple-wave-2 {
  position: absolute;
  height: inherit;
  width: inherit;
}
.ripple-wave .ripple-wave-2::before {
  content: '';
  display: block;
  height: inherit;
  width: inherit;
  border-radius: 50%;
  background-color: white;
  -webkit-animation: pulse-animation 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  animation: pulse-animation 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
  -webkit-animation-delay: 0.24s;
  animation-delay: 0.24s;
}
</style>
