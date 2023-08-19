import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'students';

const studentsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/students-page`,
    component: () => import('src/modules/student/layouts/StudentLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/students-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/student/pages/StudentPage.vue')
        }
    ]
};

export default studentsRoutes;
