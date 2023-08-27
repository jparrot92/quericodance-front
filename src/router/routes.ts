import { RouteRecordRaw } from 'vue-router';

import authRouter from '../modules/auth/router';
import profileRouter from '../modules/profile/router';
import appointmentsRouter from '../modules/appointments/router';
import teacherRouter from '../modules/teacher/router';
import studentRouter from '../modules/student/router';
import userRouter from '../modules/user/router';
import activityRouter from '../modules/activity/router';

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
        ...teacherRouter
    },
    {
        ...studentRouter
    },
    {
        ...userRouter
    },
    {
        ...activityRouter
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
