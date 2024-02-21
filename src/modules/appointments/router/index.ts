import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'appointments';

const appointmentsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () =>
        import('src/modules/appointments/layouts/AppointmentsLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
            },
            component: () =>
                import('src/modules/appointments/pages/AppointmentsPage.vue'),
        },
    ],
};

export default appointmentsRoutes;
