import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'users';

const usersRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/user-page`,
    component: () => import('src/modules/users/layouts/UserLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/user-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/users/pages/UserPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/user-user-form-page/:id?`,
            name: `${ROUTE_NAME}-user-form-page`,
            component: () => import('src/modules/users/pages/UserFormPage.vue'),
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

export default usersRoutes;
