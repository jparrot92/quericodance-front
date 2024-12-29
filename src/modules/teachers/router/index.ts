import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'teachers';

const teachersRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.teachers',
            },
            component: () =>
                import('src/modules/teachers/pages/TeacherPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/teachers/pages/TeacherFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'teacher.createTeacher',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/teachers/pages/TeacherFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'teacher.editTeacher',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default teachersRoutes;
