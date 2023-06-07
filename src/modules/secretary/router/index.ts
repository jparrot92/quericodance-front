import { RouteRecordRaw } from 'vue-router';

const secretaryRoutes: RouteRecordRaw = {
    path: '/secretary',
    name: 'secretary',
    component: () =>
        import('src/modules/secretary/layouts/SecretaryLayout.vue'),
    children: [
        {
            path: '',
            name: 'secretary-page',
            component: () =>
                import('src/modules/secretary/pages/SecretaryPage.vue')
        }
    ]
};

export default secretaryRoutes;
