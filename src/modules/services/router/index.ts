import { RouteRecordRaw } from 'vue-router';

import tariffsRoutes from '../modules/tariffs/router';
import passesRoutes from '../modules/passes/router';
import personalClasses from '../modules/personalClasses/router';

const servicesRoutes: RouteRecordRaw[] = [
    {
        ...tariffsRoutes,
    },
    {
        ...passesRoutes,
    },
    {
        ...personalClasses,
    },
];

export default servicesRoutes;
