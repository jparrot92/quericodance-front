import { RouteRecordRaw } from 'vue-router';

import authRouter from '../modules/auth/router';
import profileRouter from '../modules/profile/router';
import appointmentsRouter from '../modules/appointments/router';
import doctorRouter from '../modules/doctor/router';
import patientRouter from '../modules/patient/router';
import secretaryRouter from '../modules/secretary/router';
import adminRouter from '../modules/admin/router';

const routes: RouteRecordRaw[] = [
    {
        ...authRouter
    },
    {
        ...profileRouter
    },
    {
        ...appointmentsRouter
    },
    {
        ...doctorRouter
    },
    {
        ...patientRouter
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
