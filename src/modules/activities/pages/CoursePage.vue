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

import { Action, ColumnTable, WeekDay } from 'src/types/UtilTypes';
import { CourseListViewDTO, CourseDTO } from 'src/model/activity.model';

import { FilterField, FilterFieldType } from 'src/composables/useFilterTypes';
import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';

import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useCourses from '../composables/useCourses';

import ActivityItem from '../components/activity-item/ActivityItem.vue';

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const { saveFiltersToLocalStorage, loadFiltersFromLocalStorage } =
    useLocalStorageFilters();
const { generateEnumOptions } = useEnumOptions();
const { loading, courses, loadCourses, removeCourse, handleFileDownload } =
    useCourses();

const weekDays = generateEnumOptions(WeekDay);

const coursesFiltered = ref<CourseListViewDTO[]>([]);
const showProfitability = ref(false);

const columns = computed((): ColumnTable[] => [
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'level',
        align: 'left',
        label: t('course.level'),
        field: 'level',
        sortable: true,
    },
    {
        name: 'day',
        align: 'left',
        label: t('course.day'),
        field: (row) => t('shared.enum.' + row.day),
        sortable: true,
        sort: (
            a: string,
            b: string,
            rowA: CourseListViewDTO,
            rowB: CourseListViewDTO
        ) => orderByDay(rowA, rowB),
    },
    {
        name: 'startHour',
        align: 'left',
        label: t('course.startHour'),
        field: 'startHour',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'endHour',
        align: 'left',
        label: t('course.endHour'),
        field: 'endHour',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberPlaces',
        align: 'left',
        label: t('course.numberPlaces'),
        field: 'numberPlaces',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberStudents',
        align: 'left',
        label: t('course.numberStudents'),
        field: 'numberStudents',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberLeaders',
        align: 'left',
        label: t('course.numberLeaders'),
        field: 'numberLeaders',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'numberFollowers',
        align: 'left',
        label: t('course.numberFollowers'),
        field: 'numberFollowers',
        sortable: true,
        headerStyle: 'white-space: pre;',
    },
    {
        name: 'costEffectiveness',
        align: 'left',
        label: t('course.costEffectiveness'),
        field: 'costEffectiveness',
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'totalPaid',
        align: 'left',
        label: t('course.totalPaid'),
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
]);

const actions: ComputedRef<Action<CourseListViewDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.see'),
            action: (row: CourseListViewDTO) => {
                router.push({
                    name: 'courses-list-students',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.edit'),
            action: (row: CourseListViewDTO) => {
                router.push({
                    name: 'courses-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: CourseListViewDTO) => handleRemoveActivity(row.id),
            show: () => true,
        },
    ];
});

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

const filters: Ref<Array<FilterField>> = ref([
    {
        field: 'weekDay',
        label: t('course.day'),
        options: weekDays,
        type: FilterFieldType.SELECT,
    },
] as Array<FilterField>);

const filteredColumns = computed(() => {
    if (showProfitability.value) {
        return columns.value;
    } else {
        return columns.value.filter(
            (column) =>
                column.name !== 'costEffectiveness' &&
                column.name !== 'totalPaid'
        );
    }
});

loadFiltersFromLocalStorage(filtersSelected);

const filterTable = () => {
    coursesFiltered.value = courses.value
        .filter((activity: CourseListViewDTO) => {
            const activityFullName =
                activity.name.toLowerCase() + activity.level;

            return activityFullName.includes(
                filtersSelected.query.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((activity: CourseListViewDTO) => {
            if (filtersSelected.weekDay === null) {
                return true;
            } else {
                return activity.day === filtersSelected.weekDay;
            }
        });
};

const getWeekNumber = (day: WeekDay): number => {
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
};

const orderByDay = (a: CourseListViewDTO, b: CourseListViewDTO) => {
    const dayA = a.day ? getWeekNumber(a.day) : -1;
    const dayB = b.day ? getWeekNumber(b.day) : -1;

    // Cambiar el orden de retorno para ordenar de mayor a menor
    if (dayA > dayB) return -1;
    if (dayA < dayB) return 1;
    return 0;
};

const onRowClick = (evt: Event, row: CourseListViewDTO) => {
    let title = `${t('course.course')} ${row.name} ${row.level} - ${t(
        'shared.enum.' + row.day
    )} ${row.startHour}`;

    router.push({
        name: 'courses-list-students',
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
        await removeCourse(idActivity);
        const index = coursesFiltered.value?.findIndex(
            (activity: CourseDTO) => activity.id === idActivity
        );
        if (index !== undefined && index !== -1) {
            coursesFiltered.value?.splice(index, 1);
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
    await loadCourses();
    coursesFiltered.value = courses.value;
    filterTable();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="coursesFiltered"
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
                            :placeholder="$t('course.serachPlaceholder')"
                        ></pd-filter>
                    </div>
                    <div class="col-sm-2 col-xs-12 flex justify-end">
                        <q-toggle
                            :label="$t('course.showProfitability')"
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
                            :label="$t('course.createCourse')"
                            color="primary"
                            icon="mdi-plus"
                            dense
                            class="h-2-5rem"
                            @click="
                                $router.push({
                                    name: 'courses-add',
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
                        name: 'courses-add',
                    })
                "
                icon="mdi-plus"
                :label="$t('course.createCourse')"
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
../composables/useCourses
