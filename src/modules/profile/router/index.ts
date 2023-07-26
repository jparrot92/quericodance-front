import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'profile';

const profileRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/profile-page`,
    component: () => import('src/modules/profile/layouts/ProfileLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/profile-form-page`,
            name: `${ROUTE_NAME}-form-page`,
            component: () =>
                import('src/modules/profile/pages/ProfileFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'profile.label.profile'
            }
        }
    ]
};

export default profileRoutes;
