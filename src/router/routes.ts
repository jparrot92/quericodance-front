import { RouteRecordRaw } from 'vue-router';

import authRouter from '../modules/auth/router';
import profileRouter from '../modules/profile/router';
import appointmentsRouter from '../modules/appointments/router';
import teachersRoutes from '../modules/teachers/router';
import studentsRoutes from '../modules/students/router';
import usersRoutes from '../modules/users/router';
import activitiesRoutes from '../modules/activities/router';
import tariffsRoutes from '../modules/tariffs/router';

const routes: RouteRecordRaw[] = [
    {
        ...authRouter,
    },
    {
        ...profileRouter,
    },
    {
        ...appointmentsRouter,
    },
    {
        ...teachersRoutes,
    },
    {
        ...studentsRoutes,
    },
    {
        ...usersRoutes,
    },
    {
        ...activitiesRoutes,
    },
    {
        ...tariffsRoutes,
    },
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
