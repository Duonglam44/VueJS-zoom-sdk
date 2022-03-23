import Vue from 'vue'
import Router from 'vue-router'
import PhoneLogListPage from './page/PhoneLogListPage'
import PhoneCallPage from './page/PhoneCallPage'
import PhoneLogPage from './page/PhoneLogPage'

Vue.use(Router)

export default new Router({
  routes: [
    { 
      path: '/',
      component: PhoneLogListPage,
      meta: { index: 0, },
     },
    { 
      path: '/phone_call', 
      component: PhoneCallPage,
      meta: { index: 1, },
    },
    { 
      path: '/phone_log',
      component: PhoneLogPage,
      meta: { index: 2, },
    },
  ]
})