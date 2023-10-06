<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useActivities from '../../composables/useActivities';

const { loading, activities, loadActivities, removeActivity } = useActivities();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadActivities();
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
    headerStyle?: string;
}

const columnsUser: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('activity.label.name'),
        field: 'name',
        sortable: true
    },
    {
        name: 'day',
        align: 'left',
        label: t('activity.label.day'),
        field: (row) => t('shared.label.' + row.day),
        sortable: true
    },
    {
        name: 'level',
        align: 'left',
        label: t('activity.label.level'),
        field: 'level',
        sortable: true
    },
    {
        name: 'startHour',
        align: 'left',
        label: t('activity.label.startHour'),
        field: 'startHour',
        sortable: true,
        headerStyle: 'white-space: pre;'
    },
    {
        name: 'endHour',
        align: 'left',
        label: t('activity.label.endHour'),
        field: 'endHour',
        sortable: true,
        headerStyle: 'white-space: pre;'
    },
    {
        name: 'numberPlaces',
        align: 'left',
        label: t('activity.label.numberPlaces'),
        field: 'numberPlaces',
        sortable: true,
        headerStyle: 'white-space: pre;'
    },
    {
        name: 'numberStudents',
        align: 'left',
        label: t('activity.label.numberStudents'),
        field: 'numberStudents',
        sortable: true,
        headerStyle: 'white-space: pre;'
    },
    {
        name: 'numberLeaders',
        align: 'left',
        label: t('activity.label.numberLeaders'),
        field: 'numberLeaders',
        sortable: true,
        headerStyle: 'white-space: pre;'
    },
    {
        name: 'numberFollowers',
        align: 'left',
        label: t('activity.label.numberFollowers'),
        field: 'numberFollowers',
        sortable: true,
        headerStyle: 'white-space: pre;'
    },
    {
        name: 'costEffectiveness',
        align: 'left',
        label: t('activity.label.costEffectiveness'),
        field: 'costEffectiveness',
        format: (val, row) => `${val} €`,
        sortable: true
    },
    {
        name: 'actions',
        align: 'center',
        label: '',
        field: 'actions',
        sortable: false
    }
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="activities"
            :columns="columnsUser"
            row-key="id"
            class="col-12"
            :loading="loading"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('activity.label.activities') }}
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
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn size="12px" flat dense round icon="more_vert">
                        <q-menu>
                            <q-list style="width: 200px">
                                <q-item clickable v-close-popup>
                                    <q-item-section
                                        @click="
                                            $router.push({
                                                name: 'activities-list-students',
                                                params: { id: props.row.id }
                                            })
                                        "
                                    >
                                        {{ $t('activity.label.see') }}
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section
                                        @click="
                                            $router.push({
                                                name: 'activities-edit',
                                                params: { id: props.row.id }
                                            })
                                        "
                                    >
                                        {{ $t('activity.label.edit') }}
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section
                                        @click="removeActivity(props.row.id)"
                                    >
                                        {{ $t('activity.label.delete') }}
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
