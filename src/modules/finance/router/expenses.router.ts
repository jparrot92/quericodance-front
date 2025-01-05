import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'expenses';

const financeRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            component: () =>
                import('src/modules/finance/pages/ExpensePage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.expenses',
            },
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/finance/pages/ExpenseFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'expense.createExpense',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/finance/pages/ExpenseFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'expense.editExpense',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default financeRoutes;
