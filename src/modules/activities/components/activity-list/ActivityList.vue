<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';
import { ActivityType, ColumnTable, WeekDay } from 'src/types/UtilTypes';
import MenuList from 'src/shared/components/MenuList.vue';

import { ActivityDTO, ActivityList } from '../../models/activity';
import useActivities from '../../composables/useActivities';
import { FilterField } from 'src/composables/useFilterTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

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
const activitiesFiltered = ref<ActivityList[]>([]);
const showProfitability = ref(false);

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
                      rowA: ActivityList,
                      rowB: ActivityList
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
        .filter((activity: ActivityList) => {
            const activityFullName =
                activity.name.toLowerCase() + activity.level;

            return activityFullName.includes(
                filtersSelected.query.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((activity: ActivityList) => {
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

const orderByDay = (a: ActivityList, b: ActivityList) => {
    const dayA = getWeekNumber(a.day);
    const dayB = getWeekNumber(b.day);

    // Cambiar el orden de retorno para ordenar de mayor a menor
    if (dayA > dayB) return -1;
    if (dayA < dayB) return 1;
    return 0;
};

const onRowClick = (evt: Event, row: ActivityList) => {
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
    <div class="row">
        <q-table
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
                        <div class="col-6">
                            <pd-filter
                                v-model="filtersSelected"
                                :filters="filters"
                                :placeholder="$t('activity.serachPlaceholder')"
                            ></pd-filter>
                        </div>
                        <div class="col-2 flex justify-end">
                            <q-toggle
                                :label="$t('activity.showProfitability')"
                                class="h-2rem"
                                v-model="showProfitability"
                            ></q-toggle>
                        </div>
                        <div class="col-2 flex justify-end">
                            <q-btn
                                v-if="$q.platform.is.desktop"
                                :label="$t('shared.downloadExcel')"
                                color="green"
                                icon="mdi-download"
                                dense
                                class="h-2rem"
                                @click="handleFileDownload"
                            />
                        </div>
                        <div class="col-2 flex justify-end">
                            <q-btn
                                v-if="$q.platform.is.desktop"
                                :label="$t(labelBtnCreateActivity)"
                                color="primary"
                                icon="mdi-plus"
                                dense
                                class="h-2rem"
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
                                {{ $t('shared.see') }}
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
                                {{ $t('shared.edit') }}
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="handleRemoveActivity(props.row.id)"
                            >
                                {{ $t('shared.delete') }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
