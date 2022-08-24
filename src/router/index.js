import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';
import { authMiddleware } from './middlewares/auth';
import { guestMiddleware } from './middlewares/guest';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes,
});

router.beforeEach(guestMiddleware);
router.beforeEach(authMiddleware);

export default router;
