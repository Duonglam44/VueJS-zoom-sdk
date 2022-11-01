import Vue from 'vue';
import VueRouter from 'vue-router';

import { isElectron } from '@/shared/utils';

import routes from './routes';
import { authMiddleware } from './middlewares/auth';
import { guestMiddleware } from './middlewares/guest';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: isElectron() ? 'hash' : 'history',
  routes,
});

router.beforeEach(guestMiddleware);
router.beforeEach(authMiddleware);

export default router;
