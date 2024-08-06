import { RouteRecordRaw } from 'vue-router';

import tariffsRoutes from '../modules/tariffs/router';
import bonusesRoutes from '../modules/bonuses/router';
import personalClasses from '../modules/personalClasses/router';
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
