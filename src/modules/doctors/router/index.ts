import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'doctors';

const doctorsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/doctors-page`,
    component: () => import('src/modules/doctors/layouts/DoctorsLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/doctors-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/doctors/pages/DoctorsPage.vue')
        }
    ]
};

export default doctorsRoutes;
