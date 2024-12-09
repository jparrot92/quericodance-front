import { RouteRecordRaw } from 'vue-router';

import tariffsRoutes from './tariffs.router';
import bonusesRoutes from './bonuses.router';
import personalClasses from './personalClasses.router';

import { requireAdmin } from 'src/modules/auth/router/routeGuards';

const servicesRoutes: RouteRecordRaw[] = [
    {
        beforeEnter: [requireAdmin],
        ...tariffsRoutes,
    },
    {
        beforeEnter: [requireAdmin],
        ...bonusesRoutes,
    },
    {
        beforeEnter: [requireAdmin],
        ...personalClasses,
    },
];

export default servicesRoutes;
