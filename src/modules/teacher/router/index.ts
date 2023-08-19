import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'teachers';

const teachersRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/teachers-page`,
    component: () => import('src/modules/teacher/layouts/TeacherLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/teachers-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/teacher/pages/TeacherPage.vue')
        }
    ]
};

export default teachersRoutes;
