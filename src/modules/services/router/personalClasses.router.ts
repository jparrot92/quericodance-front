import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'personalClasses';

const personalClassesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () =>
        import('src/modules/services/layouts/PersonalClassLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
            },
            component: () =>
                import('src/modules/services/pages/PersonalClassPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/services/pages/PersonalClassFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'personalClass.createPersonalClass',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/services/pages/PersonalClassFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'personalClass.editPersonalClass',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default personalClassesRoutes;
