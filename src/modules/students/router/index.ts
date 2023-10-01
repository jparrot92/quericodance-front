import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'students';

const studentsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('src/modules/students/layouts/StudentLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/students/pages/StudentPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/students/pages/StudentFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'student.label.createStudent'
            }
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/students/pages/StudentTabsPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'student.label.editStudent'
            },
            props: (route) => {
                return {
                    id: route.params.id
                };
            }
        }
    ]
};

export default studentsRoutes;
