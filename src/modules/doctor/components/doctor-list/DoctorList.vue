<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useDoctors from '../../composables/useDoctors';

const { loading, doctors, loadDoctors, removeDoctor } = useDoctors();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadDoctors();
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
        label: t('admin.label.photo'),
        field: 'photo',
        sortable: false
    },
    {
        name: 'nif',
        align: 'left',
        label: t('admin.label.nif'),
        field: 'nif',
        sortable: true
    },
    {
        name: 'name',
        align: 'left',
        label: t('admin.label.name'),
        field: 'name',
        sortable: true
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('admin.label.surnames'),
        field: 'surnames',
        sortable: true
    },
    {
        name: 'email',
        align: 'left',
        label: t('admin.label.email'),
        field: 'email',
        sortable: true
    },
    {
        name: 'role',
        align: 'left',
        label: t('admin.label.role'),
        field: 'role',
        sortable: true
    },
    {
        name: 'actions',
        align: 'right',
        label: t('admin.label.actions'),
        field: 'actions',
        sortable: false
    }
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="doctors"
            :columns="columnsUser"
            row-key="id"
            class="col-12"
            :loading="loading"
        >
            <template v-slot:top>
                <span class="text-h6"> {{ $t('doctor.label.doctors') }} </span>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('doctor.label.createDoctor')"
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
                                name: 'admin-user-form-page',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> {{ $t('admin.label.edit') }} </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-delete-outline"
                        color="negative"
                        dense
                        size="sm"
                        @click="removeDoctor(props.row.id)"
                    >
                        <q-tooltip> {{ $t('admin.label.delete') }} </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
