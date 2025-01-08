import { RouteRecordRaw } from 'vue-router';

import courses from './courses.router';
import events from './events.router';

import { requireAdmin } from 'src/modules/auth/router/routeGuards';

const activitiesRoutes: RouteRecordRaw[] = [
    {
        beforeEnter: [requireAdmin],
        ...courses,
    },
    {
        beforeEnter: [requireAdmin],
        ...events,
    },
];

export default activitiesRoutes;
