<script setup lang="ts">
import { useQuasar } from 'quasar';

import useAuth from 'src/modules/auth/composables/useAuth';

const $q = useQuasar();

const { logout } = useAuth();

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
    <q-header elevated>
        <q-toolbar>
            <q-btn
                flat
                dense
                round
                icon="menu"
                aria-label="Menu"
                @click="$emit('toggleLeftDrawer')"
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
</template>
