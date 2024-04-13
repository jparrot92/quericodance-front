import { RouteRecordRaw } from 'vue-router';

import tariffsRoutes from '../modules/tariffs/router';
import passesRoutes from '../modules/passes/router';

const servicesRoutes: RouteRecordRaw[] = [tariffsRoutes, passesRoutes];

export default servicesRoutes;
