import { RouteRecordRaw } from 'vue-router';

import authRouter from '../modules/auth/router';
import appointmentsRouter from '../modules/appointments/router';
import routesAdmin from './routesAdmin';
import routesStudent from './routesStudent';

const routes: RouteRecordRaw[] = [
    {
        ...authRouter,
    },
    {
        ...appointmentsRouter,
    },
    ...routesAdmin,
    routesStudent,
    //default route redirection
    { path: '/', redirect: { name: 'appointments-list' } },
    /*{
        path: '/',
        name: 'main',
        meta: { requiresAuth: true },
        beforeEnter: [requireAuth],
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/IndexPage.vue') }]
    },*/

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
