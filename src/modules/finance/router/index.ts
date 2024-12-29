import { RouteRecordRaw } from 'vue-router';

import payments from './payments.router';

import { requireAdmin } from 'src/modules/auth/router/routeGuards';

const servicesRoutes: RouteRecordRaw[] = [
    {
        beforeEnter: [requireAdmin],
        ...payments,
    },
];

export default servicesRoutes;
