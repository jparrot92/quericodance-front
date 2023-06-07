import { RouteRecordRaw } from 'vue-router';

import { requireAuth, requireAdmin } from '../modules/auth/router/routeGuards';

import authRouter from '../modules/auth/router';
import appointmentsRouter from '../modules/appointments/router';
import doctorsRouter from '../modules/doctors/router';
import patientsRouter from '../modules/patients/router';
import secretaryRouter from '../modules/secretary/router';
import adminRouter from '../modules/admin/router';

const routes: RouteRecordRaw[] = [
    {
        ...authRouter
    },
    {
        ...appointmentsRouter
    },
    {
        ...doctorsRouter
    },
    {
        ...patientsRouter
    },
    {
        ...patientsRouter
    },
    {
        ...patientsRouter
    },
    {
        ...secretaryRouter
    },
    {
        ...adminRouter
    },
    //default route redirection
    { path: '/', redirect: { name: 'appointments-page' } },
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
        component: () => import('pages/ErrorNotFound.vue')
    }
];

export default routes;
