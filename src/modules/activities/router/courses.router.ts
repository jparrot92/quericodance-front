import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'courses';

const coursesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            component: () =>
                import('src/modules/activities/pages/CoursePage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.courses',
            },
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/activities/pages/CourseFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'course.createCourse',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/activities/pages/CourseFormPage.vue'),
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
            meta: {
                toolbar: 'DetailToolbar',
                title: 'course.editCourse',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id/students`,
            name: `${ROUTE_NAME}-list-students`,
            component: () =>
                import('src/modules/students/pages/StudentPage.vue'),
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
            meta: {
                toolbar: 'DetailToolbar',
            },
            beforeEnter: (to, from, next) => {
                to.meta.title = to.query.name;
                next();
            },
        },
    ],
};

export default coursesRoutes;
