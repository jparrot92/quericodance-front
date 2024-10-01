import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'finances';

const financeRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('src/modules/finance/layouts/FinanceLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            component: () =>
                import('src/modules/finance/pages/FinancePage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.finances',
            },
        },
    ],
};

export default financeRoutes;
