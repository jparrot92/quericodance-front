import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'secretary';

const secretaryRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/secretary-page`,
    component: () =>
        import('src/modules/secretary/layouts/SecretaryLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/secretary-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/secretary/pages/SecretaryPage.vue')
        }
    ]
};

export default secretaryRoutes;
