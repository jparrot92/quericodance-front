import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'tariffs';

const tariffsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () =>
        import('src/modules/services/tariffs/layouts/TariffLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
            },
            component: () =>
                import('src/modules/services/tariffs/pages/TariffPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/services/tariffs/pages/TariffFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'tariff.createTariff',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/services/tariffs/pages/TariffFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'tariff.editTariff',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default tariffsRoutes;
