const PhoneLogListPage = () => import('@/page/PhoneLogListPage.vue');
const PhoneCallPage = () => import('@/page/PhoneCallPage.vue');
const PhoneLogPage = () => import('@/page/PhoneLogPage.vue');
const Login = () => import('@/page/Login.vue');
const ProfilePage = () => import('@/page/ProfilePage.vue');

const routes = [
  {
    path: '/',
    component: PhoneLogListPage,
    name: 'Home',
    meta: { index: 0, requiresAuth: true },
  },
  {
    path: '/phone_call',
    name: 'PhoneCall',
    component: PhoneCallPage,
    meta: { index: 1, requiresAuth: true },
  },
  {
    path: '/phone_log',
    name: 'PhoneLog',
    component: PhoneLogPage,
    meta: { index: 2, requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/profile',
    component: ProfilePage,
    name: 'Profile',
    meta: { requiresAuth: true },
  },
];

export default routes;
