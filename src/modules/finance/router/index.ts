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
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/finance/pages/FinanceFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.createFinance',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/finance/pages/FinanceFormPage.vue'),
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.editFinance',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id/students`,
            name: `${ROUTE_NAME}-list-students`,

            component: () =>
                import('src/modules/students/pages/StudentPage.vue'),
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
            meta: {
                toolbar: 'DetailToolbar',
            },
            beforeEnter: (to, from, next) => {
                to.meta.title = to.query.name;
                next();
            },
        },
    ],
};

export default financeRoutes;
