<script setup lang="ts">
import {
    ComputedRef,
    Ref,
    computed,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import {
    Action,
    ActivityType,
    ColumnTable,
    WeekDay,
} from 'src/types/UtilTypes';
import { ActivityListViewDTO, ActivityDTO } from 'src/model/activity.model';

import { FilterField } from 'src/composables/useFilterTypes';
import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';

import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useActivities from '../../composables/useActivities';

import ActivityItem from '../activity-item/ActivityItem.vue';

const props = withDefaults(
    defineProps<{
        activityType: string;
    }>(),
    {}
);

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const { saveFiltersToLocalStorage, loadFiltersFromLocalStorage } =
    useLocalStorageFilters();
const { generateEnumOptions } = useEnumOptions();

const {
    loading,
    activities,
    loadActivities,
    removeActivity,
    handleFileDownload,
} = useActivities();

const weekDays = generateEnumOptions(WeekDay);
const activitiesFiltered = ref<ActivityListViewDTO[]>([]);
const showProfitability = ref(false);

const actions: ComputedRef<Action<ActivityListViewDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.see'),
            action: (row: ActivityListViewDTO) => {
                router.push({
                    name: 'activities-list-students',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.edit'),
            action: (row: ActivityListViewDTO) => {
                router.push({
                    name: 'activities-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: ActivityListViewDTO) => handleRemoveActivity(row.id),
            show: () => true,
        },
    ];
});

const columns: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: 'name',
        sortable: true,
    },
    ...(props.activityType === 'event'
        ? [
              {
                  name: 'dateEvent',
                  align: 'left',
                  label: t('activity.dateEvent'),
                  field: 'dateEvent',
                  sortable: true,
              } as ColumnTable,
          ]
        : [
              {
                  name: 'level',
                  align: 'left',
                  label: t('activity.level'),
                  field: 'level',
                  sortable: true,
              } as ColumnTable,
              {
                  name: 'day',
                  align: 'left',
                  label: t('activity.day'),
                  field: (row) => t('shared.enum.' + row.day),
                  sortable: true,
                  sort: (
                      a: string,
                      b: string,
                      rowA: ActivityListViewDTO,
                      rowB: ActivityListViewDTO
                  ) => orderByDay(rowA, rowB),
              } as ColumnTable,
          ]),
    {
        name: 'startHour',
        align: 'left',
        label: t('activity.startHour'),
        field: 'startHour',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'endHour',
        align: 'left',
        label: t('activity.endHour'),
        field: 'endHour',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberPlaces',
        align: 'left',
        label: t('activity.numberPlaces'),
        field: 'numberPlaces',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberStudents',
        align: 'left',
        label: t('activity.numberStudents'),
        field: 'numberStudents',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberLeaders',
        align: 'left',
        label: t('activity.numberLeaders'),
        field: 'numberLeaders',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberFollowers',
        align: 'left',
        label: t('activity.numberFollowers'),
        field: 'numberFollowers',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'costEffectiveness',
        align: 'left',
        label: t('activity.costEffectiveness'),
        field: 'costEffectiveness',
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'totalPaid',
        align: 'left',
        label: t('activity.totalPaid'),
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

const filtersSelected = reactive({
    id: 'activity',
    query: '',
    weekDay: null,
    pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
    },
});

loadFiltersFromLocalStorage(filtersSelected);

const filters: Ref<Array<FilterField>> = ref([
    {
        field: 'weekDay',
        label: t('activity.day'),
        options: weekDays,
    },
] as Array<FilterField>);

const filterTable = () => {
    activitiesFiltered.value = activities.value
        .filter((activity: ActivityListViewDTO) => {
            const activityFullName =
                activity.name.toLowerCase() + activity.level;

            return activityFullName.includes(
                filtersSelected.query.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((activity: ActivityListViewDTO) => {
            if (filtersSelected.weekDay === null) {
                return true;
            } else {
                return activity.day === filtersSelected.weekDay;
            }
        });
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

const labelBtnCreateActivity = computed((): string => {
    switch (props.activityType) {
        case ActivityType.CLASS:
            return 'activity.createclass';
        case ActivityType.EVENT:
            return 'activity.createevent';
        default:
            return 'activity.createclass';
    }
});

function getWeekNumber(day: WeekDay): number {
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

const orderByDay = (a: ActivityListViewDTO, b: ActivityListViewDTO) => {
    const dayA = a.day ? getWeekNumber(a.day) : -1;
    const dayB = b.day ? getWeekNumber(b.day) : -1;

    // Cambiar el orden de retorno para ordenar de mayor a menor
    if (dayA > dayB) return -1;
    if (dayA < dayB) return 1;
    return 0;
};

const onRowClick = (evt: Event, row: ActivityListViewDTO) => {
    let title = `${t('activity.activity')} ${row.name} ${row.level} - ${t(
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

const handleRemoveActivity = async (idActivity: number) => {
    try {
        await removeActivity(idActivity);
        const index = activitiesFiltered.value?.findIndex(
            (activity: ActivityDTO) => activity.id === idActivity
        );
        if (index !== undefined && index !== -1) {
            activitiesFiltered.value?.splice(index, 1);
        }
    } catch (error) {
        console.error(error);
    }
};

watch(
    filtersSelected,
    () => {
        filterTable();
        saveFiltersToLocalStorage(filtersSelected);
    },
    { deep: true }
);

onMounted(async () => {
    await loadActivities(props.activityType);
    activitiesFiltered.value = activities.value;
    filterTable();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="activitiesFiltered"
        :columns="filteredColumns"
        row-key="id"
        class="col-12 my-sticky-last-column-table"
        :loading="loading"
        @row-click="onRowClick"
        :no-data-label="$t('shared.noData')"
        :rows-per-page-label="$t('shared.recordsPerPage')"
        v-model:pagination="filtersSelected.pagination"
    >
        <template v-slot:top>
            <div class="col-12 justify-between">
                <div class="row justify-between">
                    <div class="col-sm-6 col-xs-12">
                        <pd-filter
                            v-model="filtersSelected"
                            :filters="filters"
                            :placeholder="$t('activity.serachPlaceholder')"
                        ></pd-filter>
                    </div>
                    <div class="col-sm-2 col-xs-12 flex justify-end">
                        <q-toggle
                            :label="$t('activity.showProfitability')"
                            class="h-2-5rem"
                            v-model="showProfitability"
                        ></q-toggle>
                    </div>
                    <div class="col-sm-2 flex justify-end" v-if="!$q.screen.xs">
                        <q-btn
                            :label="$t('shared.downloadExcel')"
                            color="green"
                            icon="mdi-download"
                            dense
                            class="h-2-5rem"
                            @click="handleFileDownload"
                        />
                    </div>
                    <div class="col-sm-2 flex justify-end" v-if="!$q.screen.xs">
                        <q-btn
                            :label="$t(labelBtnCreateActivity)"
                            color="primary"
                            icon="mdi-plus"
                            dense
                            class="h-2-5rem"
                            @click="
                                $router.push({
                                    name: 'activities-add',
                                    params: {
                                        activityType: activityType,
                                    },
                                })
                            "
                        />
                    </div>
                </div>
            </div>
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
                <pd-menu-list :actions="actions" :row="props.row" />
            </q-td>
        </template>
        <template v-slot:item="props">
            <activity-item
                :key="props.row.id"
                :activity-item="props.row"
                :show-profitability="showProfitability"
            >
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </activity-item>
        </template>
    </q-table>
    <q-page-sticky
        v-if="$q.screen.xs"
        position="bottom-right"
        :offset="[18, 18]"
        class="z-top"
    >
        <q-fab color="primary" direction="up" vertical-actions-align="right">
            <template v-slot:icon="{ opened }">
                <q-icon
                    :class="{
                        'example-fab-animate--hover': opened !== true,
                    }"
                    name="keyboard_arrow_up"
                />
            </template>

            <template v-slot:active-icon="{ opened }">
                <q-icon
                    :class="{ 'example-fab-animate': opened === true }"
                    name="close"
                />
            </template>

            <q-fab-action
                label-position="left"
                color="primary"
                @click="
                    $router.push({
                        name: 'activities-add',
                        params: {
                            activityType: activityType,
                        },
                    })
                "
                icon="mdi-plus"
                :label="$t(labelBtnCreateActivity)"
            />

            <q-fab-action
                label-position="left"
                color="green"
                @click="handleFileDownload"
                icon="mdi-download"
                :label="$t('shared.downloadExcel')"
            />
        </q-fab>
    </q-page-sticky>
</template>
