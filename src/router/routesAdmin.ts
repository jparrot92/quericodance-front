import { RouteRecordRaw } from 'vue-router';

import teachersRoutes from '../modules/teachers/router';
import studentsRoutes from '../modules/students/router';
import usersRoutes from '../modules/users/router';
import activitiesRoutes from '../modules/activities/router';
import financeRoutes from '../modules/finance/router/payments.router';
import servicesRoutes from '../modules/services/router';
import { requireAdmin } from 'src/modules/auth/router/routeGuards';

const routesAdmin: RouteRecordRaw[] = [
    {
        beforeEnter: [requireAdmin],
        ...teachersRoutes,
    },
    {
        beforeEnter: [requireAdmin],
        ...studentsRoutes,
    },
    {
        beforeEnter: [requireAdmin],
        ...usersRoutes,
    },
    {
        beforeEnter: [requireAdmin],
        ...activitiesRoutes,
    },
    {
        beforeEnter: [requireAdmin],
        ...financeRoutes,
    },
    ...servicesRoutes,
];

export default routesAdmin;
