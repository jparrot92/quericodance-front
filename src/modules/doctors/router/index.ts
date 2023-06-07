import { RouteRecordRaw } from 'vue-router';

const doctorsRoutes: RouteRecordRaw = {
    path: '/doctors',
    name: 'doctors',
    component: () => import('src/modules/doctors/layouts/DoctorsLayout.vue'),
    children: [
        {
            path: '',
            name: 'doctors-page',
            component: () => import('src/modules/doctors/pages/DoctorsPage.vue')
        }
    ]
};

export default doctorsRoutes;
