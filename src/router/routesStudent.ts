import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'students';

const routesStudent: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('src/modules/students/layouts/StudentLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: 'membership',
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.membership',
            },
            component: () =>
                import(
                    'src/modules/students/pages/MembershipStudentFormPage.vue'
                ),
        },
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/students/pages/StudentFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'student.createStudent',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/students/pages/StudentTabsPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'student.editStudent',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default routesStudent;
