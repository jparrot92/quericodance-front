<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useActivities from '../../composables/useActivities';

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();

const { loading, activity, loadStudentsActivity, removeActivity } =
    useActivities();
const { id } = route.params as { id: string };

onMounted(() => {
    loadStudentsActivity(+id);
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
}

const columnTable: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.label.photo'),
        field: (row) => row.student.user.photo,
        sortable: false
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: (row) => row.student.user.name,
        sortable: true
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: (row) => row.student.user.surnames,
        sortable: true
    },
    {
        name: 'phone',
        align: 'left',
        label: t('user.label.phone'),
        field: (row) => row.student.user.phone,
        sortable: true
    },
    {
        name: 'danceRole',
        align: 'left',
        label: t('student.label.role'),
        field: (row) => row.danceRole,
        sortable: true
    },
    {
        name: 'actions',
        align: 'right',
        label: t('activity.label.actions'),
        field: 'actions',
        sortable: false
    }
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="activity.activitiesStudent"
            :columns="columnTable"
            row-key="id"
            class="col-12"
            :loading="loading"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('activity.label.activity') }} {{ activity.name }}
                    {{ activity.level }} -
                    {{ $t('shared.label.' + activity.day) }}
                    {{ activity.startHour }}
                </span>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('activity.label.createActivity')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'activities-add'
                        })
                    "
                />
            </template>
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.student.user.photo">
                        <q-img :ratio="1" :src="props.row.student.user.photo" />
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
                        icon="mdi-eye-outline"
                        color="positive"
                        dense
                        size="sm"
                        @click="
                            $router.push({
                                name: 'activities-list-students',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> {{ $t('activity.label.see') }} </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-pencil-outline"
                        color="info"
                        dense
                        size="sm"
                        @click="
                            $router.push({
                                name: 'activities-edit',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> {{ $t('activity.label.edit') }} </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-delete-outline"
                        color="negative"
                        dense
                        size="sm"
                        @click="removeActivity(props.row.id)"
                    >
                        <q-tooltip>
                            {{ $t('activity.label.delete') }}
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
