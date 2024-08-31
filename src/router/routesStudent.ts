import { RouteRecordRaw } from 'vue-router';

const ROUTE_NAME = 'students';

const routesStudent: RouteRecordRaw = {
    path: `/${ROUTE_NAME}`,
    component: () => import('src/modules/students/layouts/StudentLayout.vue'),
    children: [
        {
            path: '/membership',
            name: 'membership',
            meta: {
                toolbar: 'MainToolbar',
                title: 'student.membership',
            },
            component: () =>
                import(
                    'src/modules/students/pages/MembershipStudentFormPage.vue'
                ),
        },
        {
            path: '/bonuses',
            name: 'bonuses',
            meta: {
                toolbar: 'MainToolbar',
                title: 'student.bonuses',
            },
            component: () =>
                import('src/modules/students/pages/BonusesStudentFormPage.vue'),
        },
        {
            path: '/courses',
            name: 'courses',
            meta: {
                toolbar: 'MainToolbar',
                title: 'student.courses',
            },
            component: () =>
                import(
                    'src/modules/students/pages/ActivitiesStudentFormPage.vue'
                ),
        },
    ],
};

export default routesStudent;
