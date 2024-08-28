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
            path: '/register',
            name: 'register',
            component: () =>
                import('src/modules/students/pages/StudentFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'auth.register',
            },
        },
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: () =>
                import('src/modules/auth/pages/ForgotPasswordPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'auth.forgotPassword',
            },
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('src/modules/auth/pages/ResetPassword.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'auth.forgotPassword',
            },
        },
    ],
};

export default authRoutes;
