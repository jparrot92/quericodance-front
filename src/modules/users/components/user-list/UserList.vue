<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useUsers from '../../composables/useUsers';

const { loading, users, loadUsers, removeUser } = useUsers();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadUsers();
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
}

const columnsUser: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.label.photo'),
        field: 'photo',
        sortable: false
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: 'name',
        sortable: true
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: 'surnames',
        sortable: true
    },
    {
        name: 'email',
        align: 'left',
        label: t('user.label.email'),
        field: 'email',
        sortable: true
    },
    {
        name: 'roles',
        align: 'left',
        label: t('user.label.permissions'),
        field: 'roles',
        sortable: true
    },
    {
        name: 'actions',
        align: 'right',
        label: t('user.label.actions'),
        field: 'actions',
        sortable: false
    }
];
</script>

<template>
    <div class="row"></div>
</template>
