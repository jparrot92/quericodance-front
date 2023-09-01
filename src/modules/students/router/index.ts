import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'students';

const studentsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/students-page`,
    component: () => import('src/modules/students/layouts/StudentLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/students-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/students/pages/StudentPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/student-form-page/:id?`,
            name: `${ROUTE_NAME}-student-form-page`,
            component: () =>
                import('src/modules/students/pages/StudentFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'user.label.createUser',
                titleEdit: 'user.label.editUser'
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
