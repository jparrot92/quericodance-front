import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'events';

const financeRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            component: () =>
                import('src/modules/activities/pages/EventPage.vue'),
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.events',
            },
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/activities/pages/EventFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'event.createEvent',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/activities/pages/EventFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'event.editEvent',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default financeRoutes;
