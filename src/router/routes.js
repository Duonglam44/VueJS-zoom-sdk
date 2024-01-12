const Login = () => import('@/page/Login');
const NotFoundPage = () => import('@/page/NotFoundPage.vue');
const AuthLayout = () => import('@/components/layouts/AuthLayout.vue');

const routes = [
  {
    path: '/',
    component: AuthLayout,
    name: 'Home',
    redirect: () => {},
    children: [],
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
