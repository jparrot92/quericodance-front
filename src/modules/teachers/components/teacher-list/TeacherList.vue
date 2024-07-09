<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import MenuList from 'src/shared/components/MenuList.vue';

import { Teacher } from '../../models/teacher';
import useTeachers from '../../composables/useTeachers';

const { loading, teachers, loadTeachers, removeTeacher } = useTeachers();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadTeachers();
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string | ((row: Teacher) => string);
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
}

const columnsUser: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.label.photo'),
        field: (row: Teacher) => row.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: (row: Teacher) => row.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: (row: Teacher) => row.user.surnames,
        sortable: true,
    },
    {
        name: 'email',
        align: 'left',
        label: t('user.label.email'),
        field: (row: Teacher) => row.user.email,
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
            :rows="teachers"
            :columns="columnsUser"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.noData')"
            :rows-per-page-label="$t('shared.recordsPerPage')"
        >
            <template v-slot:top>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('teacher.label.createTeacher')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'teachers-add',
                        })
                    "
                />
            </template>
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.user.photo">
                        <q-img :ratio="1" :src="props.row.user.photo" />
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
                <q-td :props="props">
                    <menu-list>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="
                                    $router.push({
                                        name: 'teachers-edit',
                                        params: { id: props.row.id },
                                    })
                                "
                            >
                                {{ $t('user.label.edit') }}
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="removeTeacher(props.row.id)"
                            >
                                {{ $t('user.label.delete') }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
