import Vue from 'vue';
import Router from 'vue-router';

const PhoneLogListPage = () => import('./page/PhoneLogListPage.vue');
const PhoneCallPage = () => import('./page/PhoneCallPage.vue');
const PhoneLogPage = () => import('./page/PhoneLogPage.vue');
const Login = () => import('./page/Login.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: PhoneLogListPage,
      meta: { index: 0 },
    },
    {
      path: '/phone_call',
      component: PhoneCallPage,
      meta: { index: 1 },
    },
    {
      path: '/phone_log',
      component: PhoneLogPage,
      meta: { index: 2 },
    },
    {
      path: '/login',
      component: Login,
    },
  ],
});
