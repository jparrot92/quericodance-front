<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import MenuList from 'src/shared/components/MenuList.vue';

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
    field: string | ((row: any) => string);
    align?: 'left' | 'right' | 'center';
    format?: any;
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
        format: (val: number) => `${val} €`,
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
            :no-data-label="$t('shared.label.noData')"
            :rows-per-page-label="$t('shared.label.recordsPerPage')"
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
            <template v-slot:body-cell-numberLeaders="props">
                <q-td :props="props">
                    <div>
                        <q-badge color="blue" :label="props.value" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-numberFollowers="props">
                <q-td :props="props">
                    <div>
                        <q-badge color="pink" :label="props.value" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-costEffectiveness="props">
                <q-td :props="props">
                    <div>
                        <q-badge color="green" :label="props.value" />
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
                                        name: 'activities-list-students',
                                        params: {
                                            id: props.row.id
                                        }
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
                                        params: {
                                            id: props.row.id
                                        }
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
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
