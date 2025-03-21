import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'users';

const usersRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.users',
            },
            component: () => import('src/modules/users/pages/UserPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () => import('src/modules/users/pages/UserFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'user.createUser',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () => import('src/modules/users/pages/UserFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'user.editUser',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default usersRoutes;
