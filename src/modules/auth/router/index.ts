import { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw = {
    path: '/auth',
    name: 'auth',
    component: () => import('src/modules/auth/layouts/AuthLayout.vue'),
    children: [
        {
            path: '',
            name: 'login',
            component: () => import('src/modules/auth/pages/LoginPage.vue')
        }
    ]
};

export default authRoutes;
