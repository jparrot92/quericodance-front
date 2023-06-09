<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AppToolbar from 'src/shared/components/AppToolbar.vue';

import MenuItemDrawer, {
    ItemMenu
} from 'src/shared/components/MenuItemDrawer.vue';

const { t } = useI18n();

const itemsMenu: ItemMenu[] = [
    {
        title: t('shared.label.calendar'),
        icon: 'calendar_month',
        link: 'appointments-page'
    },
    {
        title: t('shared.label.secretary'),
        icon: 'assignment_ind',
        link: 'secretary-page'
    },
    {
        title: t('shared.label.doctor'),
        icon: 'local_hospital',
        link: 'doctors-page'
    },
    {
        title: t('shared.label.patient'),
        icon: 'personal_injury',
        link: 'patients-page'
    },
    {
        title: t('shared.label.admin'),
        icon: 'engineering',
        link: 'admin-page'
    }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
    <AppToolbar @toggleLeftDrawer="toggleLeftDrawer()" />

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
