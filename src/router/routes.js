const PhoneLogListPage = () => import('@/page/PhoneLogListPage');
const PhoneCallPage = () => import('@/page/PhoneCallPage.vue');
const PhoneLogPage = () => import('@/page/PhoneLogPage.vue');
const Login = () => import('@/page/Login');
const ProfilePage = () => import('@/page/ProfilePage.vue');
const NotFoundPage = () => import('@/page/NotFoundPage.vue');
const AuthLayout = () => import('@/components/layouts/AuthLayout.vue');

const routes = [
  {
    path: '/',
    component: AuthLayout,
    name: 'Home',
    redirect: () => ({ name: 'PhoneLogListRoute' }),
    children: [
      {
        path: '/phone_log_list',
        name: 'PhoneLogListRoute',
        component: PhoneLogListPage,
        meta: { requiresAuth: true },
      },
      {
        path: '/phone_call',
        name: 'PhoneCallRoute',
        component: PhoneCallPage,
        meta: { requiresAuth: true },
      },
      {
        path: '/phone_log/:id',
        name: 'PhoneLogRoute',
        component: PhoneLogPage,
        meta: { requiresAuth: true },
      },
      {
        path: '/profile',
        component: ProfilePage,
        name: 'ProfileRoute',
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'LoginRoute',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '*',
    component: NotFoundPage,
    name: 'NotFoundRoute',
  },
];

export default routes;
