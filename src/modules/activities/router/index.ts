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
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/activities/pages/ActivityPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/activities/pages/ActivityFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.label.createActivity'
            }
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/activities/pages/ActivityFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.label.editActivity'
            },
            props: (route) => {
                return {
                    id: route.params.id
                };
            }
        }
    ]
};

export default activitiesRoutes;
