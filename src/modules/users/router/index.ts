import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'users';

const usersRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('src/modules/users/layouts/UserLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
            },
            component: () => import('src/modules/users/pages/UserPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () => import('src/modules/users/pages/UserFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'user.label.createUser',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () => import('src/modules/users/pages/UserFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'user.label.editUser',
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
