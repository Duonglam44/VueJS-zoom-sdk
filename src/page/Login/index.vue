<script>
import { ZoomMtg } from '@zoomus/websdk';
import {
  VUE_APP_ZOOM_CLIENT_ID,
  VUE_APP_ZOOM_CLIENT_SECRET,
} from '@/shared/config/setting';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.2/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

export default {
  computed: {
    startMeeting: () => {
      document.getElementById('zmmtg-root').style.display = 'block';
      const sdkKey = VUE_APP_ZOOM_CLIENT_ID;
      const sdkSecret = VUE_APP_ZOOM_CLIENT_SECRET;
      const meetingNumber = '81883350299';
      const passWord = 'yX1eTt';
      const role = 1;
      const userName = 'Vue.js';
      const userEmail = '';
      const registrantToken = '';
      const zakToken = '';
      const leaveUrl = 'http://localhost:5173/';

      const signature = ZoomMtg.generateSDKSignature({
        sdkKey,
        sdkSecret,
        meetingNumber,
        role,
      });

      ZoomMtg.init({
        leaveUrl,
        success: (success) => {
          console.log(success);
          ZoomMtg.join({
            signature,
            sdkKey,
            meetingNumber,
            passWord,
            userName,
            userEmail,
            tk: registrantToken,
            zak: zakToken,
            success: (success) => {
              console.log(success);
            },
            error: (error) => {
              console.log(error);
            },
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    },
  },
};
</script>

<template>
  <div>
    <h1>Zoom Meeting SDK Vue.js Sample</h1>
    <button @click="startMeeting">Join Meeting</button>
  </div>
</template>
