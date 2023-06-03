<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import useAuth from '../modules/auth/composables/useAuth';

import EssentialLink, {
    EssentialLinkProps
} from 'components/EssentialLink.vue';

const essentialLinks: EssentialLinkProps[] = [
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
const $q = useQuasar();

const { logout } = useAuth();

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

const handleLogout = async () => {
    $q.dialog({
        title: 'Logout',
        message: 'Do you really want to leave ?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        logout();
    });
};
</script>

<template>
    <q-layout view="hHh Lpr lff">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="toggleLeftDrawer"
                />

                <q-toolbar-title> Medical Date </q-toolbar-title>

                <q-btn-dropdown flat color="white" icon="person">
                    <q-list>
                        <q-item clickable v-close-popup @click="handleLogout">
                            <q-item-section>
                                <q-item-label>Profile</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="handleLogout">
                            <q-item-section>
                                <q-item-label>Logout</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list>
                <EssentialLink
                    v-for="link in essentialLinks"
                    :key="link.title"
                    v-bind="link"
                />
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>
