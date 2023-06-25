<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';

import useUsers from '../../composables/useUsers';

const { loading, users, loadUsers, removeUser } = useUsers();

const $q = useQuasar();

onMounted(() => {
    loadUsers();
});

const columnsProduct: any[] = [
    {
        name: 'photo',
        align: 'left',
        label: 'Img',
        field: 'photo',
        sortable: false
    },
    {
        name: 'nif',
        align: 'left',
        label: 'Name',
        field: 'nif',
        sortable: true
    },
    {
        name: 'name',
        align: 'left',
        label: 'Name',
        field: 'name',
        sortable: true
    },
    {
        name: 'surnames',
        align: 'left',
        label: 'Amount',
        field: 'surnames',
        sortable: true
    },
    {
        name: 'email',
        align: 'left',
        label: 'Amount',
        field: 'email',
        sortable: true
    },
    {
        name: 'role',
        align: 'left',
        label: 'Amount',
        field: 'role',
        sortable: true
    },
    {
        name: 'actions',
        align: 'right',
        label: 'Actions',
        field: 'actions',
        sortable: false
    }
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="users"
            :columns="columnsProduct"
            row-key="id"
            class="col-12"
            :loading="loading"
        >
            <template v-slot:top>
                <span class="text-h6"> Product </span>
                <q-btn
                    label="My Store"
                    dense
                    size="sm"
                    outline
                    class="q-ml-sm"
                    icon="mdi-store"
                    color="primary"
                />
                <q-btn
                    label="Copy Link"
                    dense
                    size="sm"
                    outline
                    class="q-ml-sm"
                    icon="mdi-content-copy"
                    color="primary"
                />
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    label="Add New"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'admin-user-form-page'
                        })
                    "
                />
            </template>
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.photo">
                        <img :src="props.row.photo" />
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
                                name: 'admin-user-form-page',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> Edit </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-delete-outline"
                        color="negative"
                        dense
                        size="sm"
                        @click="removeUser(props.row.id)"
                    >
                        <q-tooltip> Delete </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
