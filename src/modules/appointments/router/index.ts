import { RouteRecordRaw } from 'vue-router';

const appointmentsRoutes: RouteRecordRaw = {
    path: '/appointments',
    name: 'appointments',
    component: () =>
        import('src/modules/appointments/layouts/AppointmentsLayout.vue'),
    children: [
        {
            path: '',
            name: 'appointments-page',
            component: () =>
                import('src/modules/appointments/pages/AppointmentsPage.vue')
        }
    ]
};

export default appointmentsRoutes;
