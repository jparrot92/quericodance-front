import { RouteRecordRaw } from 'vue-router';

import { requireAuth, requireAdmin } from '../modules/auth/router/routeGuards';

import authRouter from '../modules/auth/router';

const routes: RouteRecordRaw[] = [
    {
        ...authRouter
    },
    {
        path: '/',
        name: 'main',
        meta: { requiresAuth: true },
        beforeEnter: [requireAuth],
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/IndexPage.vue') }]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
];

export default routes;
