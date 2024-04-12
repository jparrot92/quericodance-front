<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useRoute } from 'vue-router';

import MainToolbar from 'src/shared/components/MainToolbar.vue';
import DetailToolbar from 'src/shared/components/DetailToolbar.vue';

import MenuItemDrawer, {
    ItemMenu,
} from 'src/shared/components/MenuItemDrawer.vue';

const { t } = useI18n();

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
        icon: 'person',
        link: 'students-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.services'),
        icon: 'diversity_3',
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
                title: t('shared.passes'),
                icon: 'school',
                link: 'passes-list',
                level: 0.5,
                children: [],
            },
            {
                title: t('shared.personalClasses'),
                icon: 'school',
                link: 'activities-list',
                level: 0.5,
                children: [],
            },
        ],
    },
    {
        title: t('shared.activities'),
        icon: 'school',
        link: 'activities-list',
        level: 0,
        children: [],
    },
    {
        title: t('shared.teachers'),
        icon: 'school',
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
                    v-for="item in itemsMenu"
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
