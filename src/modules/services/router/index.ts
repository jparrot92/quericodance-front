import { RouteRecordRaw } from 'vue-router';

import passesRoutes from '../passes/router';

const servicesRoutes: RouteRecordRaw = {
    ...passesRoutes,
};

export default servicesRoutes;
