import { RouteRecordRaw } from 'vue-router';

import tariffsRoutes from '../modules/tariffs/router';
import bonusesRoutes from '../modules/bonuses/router';
import personalClasses from '../modules/personalClasses/router';

const servicesRoutes: RouteRecordRaw[] = [
    {
        ...tariffsRoutes,
    },
    {
        ...bonusesRoutes,
    },
    {
        ...personalClasses,
    },
];

export default servicesRoutes;
