import { RouteRecordRaw } from 'vue-router';

import tariffsRoutes from '../tariffs/router';
import passesRoutes from '../passes/router';

const servicesRoutes: RouteRecordRaw[] = [tariffsRoutes, passesRoutes];

export default servicesRoutes;
