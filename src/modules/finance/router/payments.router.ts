import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'payments';

const financeRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            component: () =>
                import('src/modules/finance/pages/PaymentPage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.payments',
            },
        },
    ],
};

export default financeRoutes;
