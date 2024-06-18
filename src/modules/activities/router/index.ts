import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'activities';

const activitiesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () =>
        import('src/modules/activities/layouts/ActivityLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            component: () =>
                import('src/modules/activities/pages/ActivityPage.vue'),
            meta: {
                toolbar: 'MainToolbar',
            },
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/activities/pages/ActivityFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.label.createActivity',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/activities/pages/ActivityFormPage.vue'),
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.label.editActivity',
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

export default activitiesRoutes;
