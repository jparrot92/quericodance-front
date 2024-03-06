<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { ColumnTable } from 'src/types/UtilTypes';
import MenuList from 'src/shared/components/MenuList.vue';

import { Activity, ActivityFilter } from '../../models/activity';
import useActivities from '../../composables/useActivities';
import ActivityListFilter from '../../components/activity-list-filter/ActivityListFilter.vue';

const { loading, activities, loadActivities, removeActivity } = useActivities();

const $q = useQuasar();

const { t } = useI18n();

const activitiesFilter = ref<Activity[]>();
const showProfitability = ref(false);

const filterTable = (activityFilter: ActivityFilter) => {
    activitiesFilter.value = activities.value.filter((activity: Activity) => {
        const activityFullName = activity.name.toLowerCase() + activity.level;

        return activityFullName.includes(
            activityFilter.textFilter.replace(/\s/g, '').toLowerCase()
        );
    });
};

const filteredColumns = computed(() => {
    if (showProfitability.value) {
        return columns;
    } else {
        return columns.filter((column) => column.name !== 'costEffectiveness');
    }
});

onMounted(async () => {
    await loadActivities();
    activitiesFilter.value = activities.value;
});

const columns: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('activity.label.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'level',
        align: 'left',
        label: t('activity.label.level'),
        field: 'level',
        sortable: true,
    },
    {
        name: 'day',
        align: 'left',
        label: t('activity.label.day'),
        field: (row) => t('shared.label.' + row.day),
        sortable: true,
    },
    {
        name: 'startHour',
        align: 'left',
        label: t('activity.label.startHour'),
        field: 'startHour',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'endHour',
        align: 'left',
        label: t('activity.label.endHour'),
        field: 'endHour',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberPlaces',
        align: 'left',
        label: t('activity.label.numberPlaces'),
        field: 'numberPlaces',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberStudents',
        align: 'left',
        label: t('activity.label.numberStudents'),
        field: 'numberStudents',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberLeaders',
        align: 'left',
        label: t('activity.label.numberLeaders'),
        field: 'numberLeaders',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberFollowers',
        align: 'left',
        label: t('activity.label.numberFollowers'),
        field: 'numberFollowers',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'costEffectiveness',
        align: 'left',
        label: t('activity.label.costEffectiveness'),
        field: 'costEffectiveness',
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'actions',
        align: 'center',
        label: '',
        field: 'actions',
        sortable: false,
    },
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="activitiesFilter"
            :columns="filteredColumns"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.label.noData')"
            :rows-per-page-label="$t('shared.label.recordsPerPage')"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('activity.label.activities') }}
                </span>
                <q-space />
                <q-toggle
                    v-model="showProfitability"
                    :label="$t('activity.label.showProfitability')"
                ></q-toggle>
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('activity.label.createActivity')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'activities-add',
                        })
                    "
                />
                <ActivityListFilter @filter-table="filterTable" />
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
                                            id: props.row.id,
                                        },
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
                                            id: props.row.id,
                                        },
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
