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
        },
        {
            path: `/${ROUTE_NAME}/student-form-page/:id?`,
            name: `${ROUTE_NAME}-student-form-page`,
            component: () =>
                import('src/modules/student/pages/StudentFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'admin.label.createUser',
                titleEdit: 'admin.label.editUser'
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
