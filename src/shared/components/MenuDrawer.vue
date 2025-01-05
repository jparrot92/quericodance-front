<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useRoute } from 'vue-router';

import MainToolbar from 'src/shared/components/MainToolbar.vue';
import DetailToolbar from 'src/shared/components/DetailToolbar.vue';

import useAuth from 'src/modules/auth/composables/useAuth';

import MenuItemDrawer, {
    ItemMenu,
} from 'src/shared/components/MenuItemDrawer.vue';

const { t } = useI18n();

const { isAdmin } = useAuth();

const route = useRoute();

const itemsMenu: ItemMenu[] = [
    {
        title: t('shared.calendar'),
        icon: 'calendar_month',
        link: 'appointments-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.students'),
        icon: 'diversity_3',
        link: 'students-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.services'),
        icon: 'mdi-package-variant-closed',
        level: 0,
        children: [
            {
                title: t('shared.tariffs'),
                icon: 'euro',
                link: 'tariffs-list',
                level: 0.5,
                children: [],
            },
            {
                title: t('shared.bonuses'),
                icon: 'mdi-ticket',
                link: 'bonuses-list',
                level: 0.5,
                children: [],
            },
            /**{
                title: t('shared.personalClasses'),
                icon: 'school',
                link: 'personalClasses-list',
                level: 0.5,
                children: [],
            },*/
        ],
    },
    {
        title: t('shared.activities'),
        icon: 'school',
        link: 'activities-class-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.events'),
        icon: 'mdi-party-popper',
        link: 'activities-event-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.finances'),
        icon: 'mdi-finance',
        level: 0,
        children: [
            {
                title: t('shared.summary'),
                icon: 'ssid_chart',
                link: 'summary',
                level: 0.5,
                children: [],
            },
            {
                title: t('shared.expenses'),
                icon: 'trending_down',
                link: 'expenses-list',
                level: 0.5,
                children: [],
            },
            {
                title: t('shared.payments'),
                icon: 'trending_up',
                link: 'payments-list',
                level: 0.5,
                children: [],
            },
        ],
    },
    {
        title: t('shared.teachers'),
        icon: 'mdi-teach',
        link: 'teachers-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.users'),
        icon: 'account_circle',
        link: 'users-list',
        level: 0,
        children: [],
    },
];

const itemsMenuStudent: ItemMenu[] = [
    {
        title: t('shared.calendar'),
        icon: 'calendar_month',
        link: 'appointments-list',
        level: 0,
        children: [],
    },
    {
        title: t('student.membership'),
        icon: 'mdi-card-account-details',
        link: 'membership',
        level: 0,
        children: [],
    },
    {
        title: t('student.bonuses'),
        icon: 'mdi-ticket',
        link: 'bonuses',
        level: 0,
        children: [],
    },
    {
        title: t('student.courses'),
        icon: 'mdi-school',
        link: 'courses',
        level: 0,
        children: [],
    },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
    <template v-if="route.meta.toolbar === 'MainToolbar'">
        <MainToolbar @toggleLeftDrawer="toggleLeftDrawer()" />

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list>
                <MenuItemDrawer
                    v-for="item in isAdmin() ? itemsMenu : itemsMenuStudent"
                    :key="item.title"
                    :item="item"
                />
            </q-list>
        </q-drawer>
    </template>
    <template v-else-if="route.meta.toolbar === 'DetailToolbar'">
        <DetailToolbar @toggleLeftDrawer="toggleLeftDrawer()" />
    </template>
</template>
