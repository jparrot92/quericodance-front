import { RouteRecordRaw } from 'vue-router';

import summary from './summary.router';
import expenses from './expenses.router';
import payments from './payments.router';

import { requireAdmin } from 'src/modules/auth/router/routeGuards';

const financeRoutes: RouteRecordRaw[] = [
    {
        beforeEnter: [requireAdmin],
        ...summary,
    },
    {
        beforeEnter: [requireAdmin],
        ...expenses,
    },
    {
        beforeEnter: [requireAdmin],
        ...payments,
    },
];

export default financeRoutes;
