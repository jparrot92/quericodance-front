<script setup lang="ts">
import { ref } from 'vue';

import AppToolbar from 'components/AppToolbar.vue';

import MenuItemDrawer, { ItemMenu } from 'components/MenuItemDrawer.vue';

const itemsMenu: ItemMenu[] = [
    {
        title: 'Calendario',
        icon: 'calendar_month',
        link: 'appointments-page'
    },
    {
        title: 'Asistente administrativo',
        icon: 'assignment_ind',
        link: 'secretary-page'
    },
    {
        title: 'Doctor',
        icon: 'local_hospital',
        link: 'doctors-page'
    },
    {
        title: 'Paciente',
        icon: 'personal_injury',
        link: 'patients-page'
    },
    {
        title: 'Administrador',
        icon: 'engineering',
        link: 'admin-page'
    }
];

const leftDrawerOpen = ref(false);
</script>

<template>
    <AppToolbar />

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
