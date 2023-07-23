import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'profile';

const profileRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/profile-page`,
    component: () => import('src/modules/profile/layouts/ProfileLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/profile-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/profile/pages/ProfilePage.vue')
        },
        {
            path: `/${ROUTE_NAME}/profile-form-page/:id?`,
            name: `${ROUTE_NAME}-form-page`,
            component: () =>
                import('src/modules/profile/pages/ProfileFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                titleCreate: 'profile.label.createUser',
                titleEdit: 'profile.label.editUser'
            },
            props: (route) => {
                return {
                    id: route.params.id
                };
            }
        }
    ]
};

export default profileRoutes;
