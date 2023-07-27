import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'patients';

const patientsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/patients-page`,
    component: () => import('src/modules/patient/layouts/PatientsLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/patients-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/patient/pages/PatientsPage.vue')
        }
    ]
};

export default patientsRoutes;
