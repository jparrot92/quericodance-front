import { RouteRecordRaw } from 'vue-router';

const patientsRoutes: RouteRecordRaw = {
    path: '/patients',
    name: 'patients',
    component: () => import('src/modules/patients/layouts/PatientsLayout.vue'),
    children: [
        {
            path: '',
            name: 'patients-page',
            component: () =>
                import('src/modules/patients/pages/PatientsPage.vue')
        }
    ]
};

export default patientsRoutes;
