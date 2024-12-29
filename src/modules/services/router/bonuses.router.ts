import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'bonuses';

const bonusesRoutes: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('layouts/MainLayout.vue'),
    children: [
        {
            path: `/${ROUTE_NAME}`,
            name: `${ROUTE_NAME}-list`,
            meta: {
                toolbar: 'MainToolbar',
                title: 'shared.bonuses',
            },
            component: () => import('src/modules/services/pages/BonusPage.vue'),
        },
        {
            path: `/${ROUTE_NAME}/add`,
            name: `${ROUTE_NAME}-add`,
            component: () =>
                import('src/modules/services/pages/BonusFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'bonus.createBonus',
            },
        },
        {
            path: `/${ROUTE_NAME}/:id`,
            name: `${ROUTE_NAME}-edit`,
            component: () =>
                import('src/modules/services/pages/BonusFormPage.vue'),
            meta: {
                toolbar: 'DetailToolbar',
                title: 'bonus.editBonus',
            },
            props: (route) => {
                return {
                    id: route.params.id,
                };
            },
        },
    ],
};

export default bonusesRoutes;
