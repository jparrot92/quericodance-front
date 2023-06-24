<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useAuth from 'src/modules/auth/composables/useAuth';

const $q = useQuasar();
const { t } = useI18n();

const { logout } = useAuth();

const handleLogout = async () => {
    $q.dialog({
        title: t('shared.label.logout'),
        message: t('shared.message.logout'),
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
                            <q-item-label>
                                {{ $t('shared.label.profile') }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="handleLogout">
                        <q-item-section>
                            <q-item-label>
                                {{ $t('shared.label.logout') }}
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </q-toolbar>
    </q-header>
</template>
