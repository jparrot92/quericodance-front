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
        title: t('shared.label.calendar'),
        icon: 'calendar_month',
        link: 'appointments-list',
    },
    {
        title: t('shared.label.students'),
        icon: 'person',
        link: 'students-list',
    },
    {
        title: t('shared.label.activities'),
        icon: 'diversity_3',
        link: 'activities-list',
    },
    {
        title: t('shared.label.teachers'),
        icon: 'school',
        link: 'teachers-list',
    },
    {
        title: t('shared.label.users'),
        icon: 'account_circle',
        link: 'users-list',
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
