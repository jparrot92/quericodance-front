<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { ColumnTable, WeekDay } from 'src/types/UtilTypes';
import MenuList from 'src/shared/components/MenuList.vue';

import { ActivityList, ActivityFilter } from '../../models/activity';
import useActivities from '../../composables/useActivities';
import ActivityListFilter from '../../components/activity-list-filter/ActivityListFilter.vue';

const { loading, activities, loadActivities, removeActivity } = useActivities();

const $q = useQuasar();

const { t } = useI18n();
const router = useRouter();

const activitiesFilter = ref<ActivityList[]>();
const showProfitability = ref(false);

const filterTable = (activityFilter: ActivityFilter) => {
    activitiesFilter.value = activities.value
        .filter((activity: ActivityList) => {
            const activityFullName =
                activity.name.toLowerCase() + activity.level;

            return activityFullName.includes(
                activityFilter.textFilter.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((activity: ActivityList) => {
            if (activityFilter.day === '') {
                return true;
            } else {
                return activity.day === activityFilter.day;
            }
        });
    showProfitability.value = activityFilter.showProfitability;
};

const filteredColumns = computed(() => {
    if (showProfitability.value) {
        return columns;
    } else {
        return columns.filter(
            (column) =>
                column.name !== 'costEffectiveness' &&
                column.name !== 'totalPaid'
        );
    }
});

onMounted(async () => {
    await loadActivities();
    activitiesFilter.value = activities.value;
});

function getWeekNumber(day: string): number {
    switch (day) {
        case WeekDay.SUNDAY:
            return 0;
        case WeekDay.MONDAY:
            return 1;
        case WeekDay.TUESDAY:
            return 2;
        case WeekDay.WEDNESDAY:
            return 3;
        case WeekDay.THURSDAY:
            return 4;
        case WeekDay.FRIDAY:
            return 5;
        case WeekDay.SATURDAY:
            return 6;
        default:
            throw new Error('Invalid day of the week');
    }
}

const orderByDay = (a: ActivityList, b: ActivityList) => {
    const dayA = getWeekNumber(a.day);
    const dayB = getWeekNumber(b.day);

    // Cambiar el orden de retorno para ordenar de mayor a menor
    if (dayA > dayB) return -1;
    if (dayA < dayB) return 1;
    return 0;
};

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
        field: (row) => t('shared.enum.' + row.day),
        sortable: true,
        sort: (a: string, b: string, rowA: ActivityList, rowB: ActivityList) =>
            orderByDay(rowA, rowB),
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
        name: 'totalPaid',
        align: 'left',
        label: t('activity.label.totalPaid'),
        field: 'totalPaid',
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

const onRowClick = (evt: Event, row: ActivityList) => {
    let title = `${t('activity.label.activity')} ${row.name} ${row.level} - ${t(
        'shared.enum.' + row.day
    )} ${row.startHour}`;

    router.push({
        name: 'activities-list-students',
        params: {
            id: row.id,
        },
        query: {
            name: title,
        },
    });
};
</script>

<template>
    <div class="row">
        <q-table
            :rows="activitiesFilter"
            :columns="filteredColumns"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            @row-click="onRowClick"
            :no-data-label="$t('shared.noData')"
            :rows-per-page-label="$t('shared.recordsPerPage')"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('activity.label.activities') }}
                </span>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    class="q-ml-sm"
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
            <template v-slot:body-cell-totalPaid="props">
                <q-td :props="props">
                    <div>
                        <q-badge color="green" :label="props.value" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <menu-list @click.stop>
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
