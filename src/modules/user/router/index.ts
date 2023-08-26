import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'user';

const userRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/user-page`,
    component: () => import('src/modules/user/layouts/UserLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/user-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/user/pages/UserPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/user-user-form-page/:id?`,
            name: `${ROUTE_NAME}-user-form-page`,
            component: () => import('src/modules/user/pages/UserFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'user.label.createUser',
                titleEdit: 'user.label.editUser'
            },
            props: (route) => {
                return {
                    id: route.params.id
                };
            }
        }
    ]
};

export default userRoutes;
