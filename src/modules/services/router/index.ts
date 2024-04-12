import { RouteRecordRaw } from 'vue-router';

import passesRoutes from '../passes/router';

const tariffsRoutes: RouteRecordRaw = {
    ...passesRoutes,
};

export default tariffsRoutes;
