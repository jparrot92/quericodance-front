<script setup lang="ts">
import { ComputedRef, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Action, ColumnTable } from 'src/types/UtilTypes';

import { UserDTO } from 'src/interfaces/user/user';

import useUsers from '../../composables/useUsers';

import UserItem from '../user-item/UserItem.vue';

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const { loading, users, loadUsers, removeUser } = useUsers();

const actions: ComputedRef<Action<UserDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.edit'),
            action: (row: UserDTO) => {
                router.push({
                    name: 'users-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: UserDTO) => removeUser(row.id),
            show: () => true,
        },
    ];
});

const columnsUser: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.photo'),
        field: 'photo',
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.surnames'),
        field: 'surnames',
        sortable: true,
    },
    {
        name: 'email',
        align: 'left',
        label: t('user.email'),
        field: 'email',
        sortable: true,
    },
    {
        name: 'roles',
        align: 'left',
        label: t('user.permissions'),
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

onMounted(() => {
    loadUsers();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="users"
        :columns="columnsUser"
        row-key="id"
        class="col-12 my-sticky-last-column-table"
        :loading="loading"
        :no-data-label="$t('shared.noData')"
        :rows-per-page-label="$t('shared.recordsPerPage')"
    >
        <template v-slot:top v-if="!$q.screen.xs">
            <q-space />
            <q-btn
                :label="$t('user.createUser')"
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
                    <q-badge color="blue" :label="role" />
                </div>
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <menu-list>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </menu-list>
            </q-td>
        </template>
        <template v-slot:item="props">
            <user-item :key="props.row.id" :user-item="props.row">
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </user-item>
        </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            v-if="$q.screen.xs"
            fab
            icon="mdi-plus"
            color="primary"
            :to="{ name: 'users-add' }"
        />
    </q-page-sticky>
</template>
