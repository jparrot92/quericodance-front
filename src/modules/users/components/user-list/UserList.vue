<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import MenuList from 'src/shared/components/MenuList.vue';

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
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: 'surnames',
        sortable: true,
    },
    {
        name: 'email',
        align: 'left',
        label: t('user.label.email'),
        field: 'email',
        sortable: true,
    },
    {
        name: 'roles',
        align: 'left',
        label: t('user.label.permissions'),
        field: 'roles',
        sortable: true,
    },
    {
        name: 'actions',
        align: 'right',
        label: '',
        field: 'actions',
        sortable: false,
    },
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="users"
            :columns="columnsUser"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.label.noData')"
            :rows-per-page-label="$t('shared.label.recordsPerPage')"
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
                            name: 'users-add',
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
            <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                    <div v-for="(role, index) in props.value" :key="index">
                        <q-badge color="green" :label="role" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <menu-list>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="
                                    $router.push({
                                        name: 'users-edit',
                                        params: { id: props.row.id },
                                    })
                                "
                            >
                                {{ $t('user.label.edit') }}
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section @click="removeUser(props.row.id)">
                                {{ $t('user.label.delete') }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
