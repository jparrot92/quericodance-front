import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'teachers';

const teachersRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/teachers-page`,
    component: () => import('src/modules/teachers/layouts/TeacherLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/teachers-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/teachers/pages/TeacherPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/teacher-form-page/:id?`,
            name: `${ROUTE_NAME}-teacher-form-page`,
            component: () =>
                import('src/modules/teachers/pages/TeacherFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'teacher.label.createTeacher',
                titleEdit: 'teacher.label.editTeacher'
            },
            props: (route) => {
                return {
                    id: route.params.id
                };
            }
        }
    ]
};

export default teachersRoutes;
