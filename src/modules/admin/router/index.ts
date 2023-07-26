import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'admin';

const adminRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    redirect: `/${ROUTE_NAME}/admin-page`,
    component: () => import('src/modules/admin/layouts/AdminLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}/admin-page`,
            name: `${ROUTE_NAME}-page`,
            meta: {
                toolbar: 'MainToolbar'
            },
            component: () => import('src/modules/admin/pages/AdminPage.vue')
        },
        {
            path: `/${ROUTE_NAME}/admin-user-form-page/:id?`,
            name: `${ROUTE_NAME}-user-form-page`,
            component: () => import('src/modules/admin/pages/UserFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'admin.label.createUser',
                titleEdit: 'admin.label.editUser'
            },
            props: (route) => {
                return {
                    id: route.params.id
                };
            }
        }
    ]
};

export default adminRoutes;
