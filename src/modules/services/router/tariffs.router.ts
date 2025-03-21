import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'tariffs';

const tariffsRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.tariffs',
            },
            component: () =>
                import('src/modules/services/pages/TariffPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/services/pages/TariffFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'tariff.createTariff',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/services/pages/TariffFormPage.vue'),
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
