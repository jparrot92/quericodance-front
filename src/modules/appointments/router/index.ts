import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'appointments';

const appointmentsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/appointments-page`,
    component: () =>
        import('src/modules/appointments/layouts/AppointmentsLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/appointments-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/appointments/pages/AppointmentsPage.vue')
        }
    ]
};

export default appointmentsRoutes;
