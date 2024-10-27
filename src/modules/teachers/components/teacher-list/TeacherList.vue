<script setup lang="ts">
import { ComputedRef, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Action, ColumnTable } from 'src/types/UtilTypes';

import { TeacherDTO } from 'src/interfaces/teacher/teacher';

import useTeachers from '../../composables/useTeachers';
import TeacherItem from '../teacher-item/TeacherItem.vue';

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const { loading, teachers, loadTeachers, removeTeacher } = useTeachers();

const actions: ComputedRef<Action<TeacherDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.edit'),
            action: (row: TeacherDTO) => {
                router.push({
                    name: 'teachers-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: TeacherDTO) => removeTeacher(row.id),
            show: () => true,
        },
    ];
});

const columnsUser: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.photo'),
        field: (row: TeacherDTO) => row.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: (row: TeacherDTO) => row.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.surnames'),
        field: (row: TeacherDTO) => row.user.surnames,
        sortable: true,
    },
    {
        name: 'email',
        align: 'left',
        label: t('user.email'),
        field: (row: TeacherDTO) => row.user.email,
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
    loadTeachers();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="teachers"
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
                :label="$t('teacher.createTeacher')"
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
                    <pd-menu-list :actions="actions" :row="props.row" />
                </menu-list>
            </q-td>
        </template>
        <template v-slot:item="props">
            <teacher-item :key="props.row.id" :teacher-item="props.row">
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </teacher-item>
        </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            v-if="$q.screen.xs"
            fab
            icon="mdi-plus"
            color="primary"
            :to="{ name: 'teachers-add' }"
        />
    </q-page-sticky>
</template>
