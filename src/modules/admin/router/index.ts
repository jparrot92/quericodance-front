import { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw = {
    path: '/admin',
    name: 'admin',
    component: () => import('src/modules/admin/layouts/AdminLayout.vue'),
    children: [
        {
            path: '',
            name: 'admin-page',
            component: () => import('src/modules/admin/pages/AdminPage.vue')
        }
    ]
};

export default adminRoutes;
