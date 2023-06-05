<script setup lang="ts">
import { ref } from 'vue';

import AppToolbar from 'components/AppToolbar.vue';

import MenuItemDrawer, { ItemMenuProps } from 'components/MenuItemDrawer.vue';

const itemsMenu: ItemMenuProps[] = [
    {
        title: 'Calendario',
        icon: 'calendar_month'
    },
    {
        title: 'Asistente administrativo',
        icon: 'assignment_ind'
    },
    {
        title: 'Doctor',
        icon: 'local_hospital'
    },
    {
        title: 'Paciente',
        icon: 'personal_injury'
    },
    {
        title: 'Administrador',
        icon: 'engineering'
    }
];

const leftDrawerOpen = ref(false);
</script>

<template>
    <AppToolbar />

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-list>
            <MenuItemDrawer
                v-for="link in itemsMenu"
                :key="link.title"
                v-bind="link"
            />
        </q-list>
    </q-drawer>
</template>
