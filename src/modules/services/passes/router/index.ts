import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'passes';

const passesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () =>
        import('src/modules/services/passes/layouts/PassLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
            },
            component: () =>
                import('src/modules/services/passes/pages/PassPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/services/passes/pages/PassFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'tariff.createPass',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/services/passes/pages/PassFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'tariff.editPass',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default passesRoutes;
