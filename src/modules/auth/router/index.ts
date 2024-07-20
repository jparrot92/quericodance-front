import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'auth';

const authRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('src/modules/auth/layouts/AuthLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: 'login',
            component: () => import('src/modules/auth/pages/LoginPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/register`,
            name: 'register',
            component: () =>
                import('src/modules/students/pages/StudentFormPage.vue'),
        },
    ],
};

export default authRoutes;
