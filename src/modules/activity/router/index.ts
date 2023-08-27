import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'activities';

const activitiesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/activities-page`,
    component: () => import('src/modules/activity/layouts/ActivityLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/activities-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () =>
                import('src/modules/activity/pages/ActivityPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/activity-form-page/:id?`,
            name: `${ROUTE_NAME}-activity-form-page`,
            component: () =>
                import('src/modules/activity/pages/ActivityFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'activity.label.createActivity',
                titleEdit: 'activity.label.editActivity'
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
