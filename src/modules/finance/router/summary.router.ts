import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'summary';

const financeRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}`,
            component: () =>
                import('src/modules/finance/pages/SummaryPage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.summary',
            },
        },
    ],
};

export default financeRoutes;
