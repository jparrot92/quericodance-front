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
        name: 'role',
        align: 'left',
        label: t('user.label.role'),
        field: 'role',
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
    <div class="row">
        <q-table
            :rows="users"
            :columns="columnsUser"
            row-key="id"
            class="col-12"
            :loading="loading"
        >
            <template v-slot:top>
                <span class="text-h6"> {{ $t('user.label.users') }} </span>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('user.label.createUser')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'users-add'
                        })
                    "
                />
            </template>
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.photo">
                        <q-img :ratio="1" :src="props.row.photo" />
                    </q-avatar>
                    <q-avatar
                        v-else
                        color="grey"
                        text-color="white"
                        icon="mdi-image-off"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-sm">
                    <q-btn
                        icon="mdi-pencil-outline"
                        color="info"
                        dense
                        size="sm"
                        @click="
                            $router.push({
                                name: 'users-edit',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> {{ $t('user.label.edit') }} </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-delete-outline"
                        color="negative"
                        dense
                        size="sm"
                        @click="removeUser(props.row.id)"
                    >
                        <q-tooltip> {{ $t('user.label.delete') }} </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
