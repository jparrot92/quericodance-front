import { RouteRecordRaw } from 'vue-router';
import { ActivityType } from 'src/types/UtilTypes';

const ROUTE_NAME = 'activities';

const activitiesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/${ActivityType.CLASS}`,
            name: `${ROUTE_NAME}-${ActivityType.CLASS}-list`,
            component: () =>
                import('src/modules/activities/pages/ClassPage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.activities',
            },
        },
        {
            path: `/${ROUTE_NAME}/${ActivityType.EVENT}`,
            name: `${ROUTE_NAME}-${ActivityType.EVENT}-list`,
            component: () =>
                import('src/modules/activities/pages/EventPage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.events',
            },
        },
        {
            path: `/${ROUTE_NAME}/add/:activityType`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/activities/pages/ActivityFormPage.vue'),
            props: (route) => {
                return {
                    activityType: route.params.activityType,
                };
            },
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.createActivity',
            },
            beforeEnter: (to, from, next) => {
                to.meta.title = `activity.create${to.params.activityType}`;
                next();
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
                title: 'activity.editActivity',
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
