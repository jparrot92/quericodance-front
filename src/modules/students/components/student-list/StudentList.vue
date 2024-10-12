<script setup lang="ts">
import {
    ref,
    onMounted,
    computed,
    Ref,
    watch,
    reactive,
    ComputedRef,
} from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { format } from '@formkit/tempo';
import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';

import {
    Action,
    ColumnTable,
    DanceRole,
    Option,
    PaymentsStatus,
    Status,
} from 'src/types/UtilTypes';

import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MenuList from 'src/shared/components/MenuList.vue';
import { FilterField } from 'src/composables/useFilterTypes';

import useStudents from '../../composables/useStudents';
import { StudentDTO } from '../../models/student';

import AddActivityAbsenceDialog from 'src/modules/students/components/AddActivityAbsenceDialog.vue';
import { ActivityDTO } from 'src/modules/activities/models/activity';

import StudentItem from '../student-item/StudentItem.vue';
import StudentListBtnAcctions from './StudentListBtnAcctions.vue';

const props = withDefaults(
    defineProps<{
        idActivity: number;
    }>(),
    {}
);

const { saveFiltersToLocalStorage, loadFiltersFromLocalStorage } =
    useLocalStorageFilters();
const { generateEnumOptions } = useEnumOptions();
const {
    loading,
    students,
    loadStudents,
    removeStudent,
    markPaymentPaid,
    sendMailPaymentPaid,
    cancelPaymentPaid,
    isPaymentStatusPaid,
} = useStudents();

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const states = generateEnumOptions(Status);
const paymentStatuses = generateEnumOptions(PaymentsStatus);
const danceRoles = generateEnumOptions(DanceRole);

const studentsFiltered = ref<StudentDTO[]>([]);
const showProfitability = ref<boolean>(false);
const showModalAddActivityAbsence = ref<boolean>(false);
const activityAbsence = ref<ActivityDTO>();
const idStudentSelected = ref<number>(0);

const actions: ComputedRef<Action<StudentDTO>[]> = computed(() => {
    return [
        {
            label: t('student.addAbsence'),
            action: (row: StudentDTO) => handleAddAbsence(row),
            condition: () => !!props.idActivity,
        },
        {
            label: t('shared.edit'),
            action: (row: StudentDTO) => {
                router.push({ name: 'students-edit', params: { id: row.id } });
            },
            condition: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: StudentDTO) => handleRemoveStudent(row.id),
            condition: () => true,
        },
    ];
});

const columnsFiltered = computed(() => {
    if (!props.idActivity) {
        return columnsUser.filter(
            (column) => column.name !== 'danceRole' && column.name !== 'price'
        );
    }
    if (showProfitability.value) {
        return columnsUser;
    } else {
        return columnsUser.filter(
            (column) =>
                column.name !== 'price' && column.name !== 'monthlyPayment'
        );
    }
});

const columnsUser: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.photo'),
        field: (row: StudentDTO) => row.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: (row: StudentDTO) => row.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.surnames'),
        field: (row: StudentDTO) => row.user.surnames,
        sortable: true,
    },
    {
        name: 'phone',
        align: 'left',
        label: t('user.phone'),
        field: (row: StudentDTO) => row.user.phone,
        sortable: true,
    },
    {
        name: 'status',
        align: 'left',
        label: t('student.state'),
        field: (row: StudentDTO) => row.status,
        sortable: true,
    },
    {
        name: 'danceRole',
        align: 'left',
        label: t('student.role'),
        field: (row: StudentDTO) => row.activitiesStudent[0].danceRole,
        sortable: true,
    },
    {
        name: 'payment',
        align: 'left',
        label: t('student.monthlyPayment'),
        field: (row: StudentDTO) => row.membership?.payment,
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'paymentStatus',
        align: 'left',
        label: t('student.paymentStatus'),
        field: (row: StudentDTO) => row.membership?.paymentStatus,
        sortable: true,
    },
    {
        name: 'mail',
        align: 'left',
        label: t('student.confirmationPayment'),
        field: 'mail',
        sortable: false,
    },
    {
        name: 'datePayment',
        align: 'left',
        label: t('student.datePayment'),
        field: (row: StudentDTO) => row.membership?.paymentDate,
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

const filtersSelected = reactive({
    id: props.idActivity ? 'activity' : 'student',
    child: props.idActivity ? true : false,
    query: '',
    status: null,
    paymentStatus: null,
    danceRole: null,
    pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: props.idActivity ? 0 : 10,
    },
});

loadFiltersFromLocalStorage(filtersSelected);

const filters: Ref<Array<FilterField>> = ref([] as Array<FilterField>);

const filterTable = () => {
    studentsFiltered.value = students.value
        .filter((student: StudentDTO) => {
            const studentFullName =
                student.user.name.toLowerCase() +
                student.user.surnames.toLowerCase() +
                student.user.email.toLowerCase();

            return studentFullName.includes(
                filtersSelected.query.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((student: StudentDTO) => {
            if (filtersSelected.status === null) {
                return true;
            } else {
                return student.status === filtersSelected.status;
            }
        })
        .filter((student: StudentDTO) => {
            if (filtersSelected.paymentStatus === null) {
                return true;
            } else {
                return (
                    student.membership?.paymentStatus ===
                    filtersSelected.paymentStatus
                );
            }
        })
        .filter((student: StudentDTO) => {
            if (
                filtersSelected.danceRole === null ||
                filtersSelected.danceRole === undefined
            ) {
                return true;
            } else {
                return (
                    student.activitiesStudent[0].danceRole ===
                    filtersSelected.danceRole
                );
            }
        });
};

const onRowClick = (evt: Event, row: StudentDTO) => {
    router.push({
        name: 'students-edit',
        params: {
            id: row.id,
        },
    });
};

const checkMonthlyPaymentPaid = async (
    student: StudentDTO,
    paymentStatus: Option
) => {
    try {
        if (paymentStatus.value === PaymentsStatus.PAYED) {
            await markPaymentPaid(student.id);
        } else {
            await cancelPaymentPaid(student.id);
        }
    } catch (error) {
        student.membership.paymentStatus = PaymentsStatus.PENDING;
    }
};

const handleSendMail = async (student: StudentDTO) => {
    sendMailPaymentPaid(student.id);
};

const handleAddAbsence = async (row: StudentDTO) => {
    idStudentSelected.value = row.id;
    showModalAddActivityAbsence.value = true;
    activityAbsence.value = row.activitiesStudent[0].activity;
};

const handleRemoveStudent = async (id: number) => {
    try {
        await removeStudent(id);
        const index = studentsFiltered.value?.findIndex(
            (student: StudentDTO) => student.id === id
        );
        if (index !== undefined && index !== -1) {
            studentsFiltered.value?.splice(index, 1);
        }
    } catch (error) {
        console.error(error);
    }
};

const getStatusColor = (status: Status): string => {
    const statusColorMap: Record<Status, string> = {
        [Status.NEW]: 'blue',
        [Status.ACTIVE]: 'green',
        [Status.INACTIVE]: 'red',
    };
    return statusColorMap[status] || 'grey';
};

watch(
    filtersSelected,
    () => {
        filterTable();
        if (!props.idActivity) {
            saveFiltersToLocalStorage(filtersSelected);
        }
    },
    { deep: true }
);

onMounted(async () => {
    filters.value = [
        {
            field: 'paymentStatus',
            label: t('student.paymentStatus'),
            options: paymentStatuses,
        },
    ] as Array<FilterField>;

    if (props.idActivity) {
        filters.value.push({
            field: 'danceRole',
            label: t('student.danceRole'),
            options: danceRoles,
        });
    } else {
        filters.value.push({
            field: 'status',
            label: t('student.status'),
            options: states,
        });
    }
    await loadStudents(props.idActivity);
    studentsFiltered.value = students.value;
    filterTable();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="studentsFiltered"
        :columns="columnsFiltered"
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
                    <div
                        :class="
                            idActivity ? 'col-12 col-sm-10' : 'col-12 col-sm-6'
                        "
                    >
                        <pd-filter
                            v-model="filtersSelected"
                            :filters="filters"
                            :placeholder="$t('student.serachPlaceholder')"
                        ></pd-filter>
                    </div>
                    <student-list-btn-acctions :id-activity="idActivity" />
                </div>
            </div>
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
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-badge
                    :color="getStatusColor(props.row.status)"
                    :label="$t('shared.enum.' + props.row.status)"
                />
            </q-td>
        </template>
        <template v-slot:body-cell-phone="props">
            <q-td :props="props">
                <a
                    @click.stop
                    :href="'https://wa.me/' + props.row.user.phone"
                    target="_blank"
                >
                    {{ props.row.user.phone }}
                </a>
            </q-td>
        </template>
        <template v-slot:body-cell-payment="props">
            <q-td :props="props">
                <q-badge
                    v-if="props.row.membership"
                    :color="
                        isPaymentStatusPaid(props.row.membership?.paymentStatus)
                            ? 'green'
                            : 'red'
                    "
                    :label="props.value"
                />
            </q-td>
        </template>
        <template v-slot:body-cell-paymentStatus="props">
            <q-td :props="props" @click.stop>
                <template v-if="props.row.membership">
                    <q-select
                        :bg-color="
                            isPaymentStatusPaid(
                                props.row.membership.paymentStatus
                            )
                                ? 'green'
                                : 'red'
                        "
                        v-model="props.row.membership.paymentStatus"
                        rounded
                        outlined
                        dense
                        options-dense
                        :options="paymentStatuses"
                        @update:model-value="
                            checkMonthlyPaymentPaid(
                                props.row,
                                props.row.membership.paymentStatus
                            )
                        "
                    >
                        <template v-slot:selected-item="{ opt }">
                            {{ t('shared.enum.' + (opt.value || opt)) }}
                        </template>
                    </q-select>
                </template>
            </q-td>
        </template>
        <template v-slot:body-cell-mail="props">
            <q-td :props="props" @click.stop>
                <template v-if="props.row.membership">
                    <q-btn
                        v-if="
                            props.row.membership?.paymentStatus &&
                            isPaymentStatusPaid(
                                props.row.membership.paymentStatus
                            )
                        "
                        color="primary"
                        rounded
                        size="md"
                        :label="$t('shared.send')"
                        @click="handleSendMail(props.row)"
                    />
                </template>
            </q-td>
        </template>
        <template v-slot:body-cell-datePayment="props">
            <q-td :props="props">
                <template v-if="props.row.membership">
                    {{
                        isPaymentStatusPaid(props.row.membership?.paymentStatus)
                            ? format(props.row.membership.datePayment)
                            : '-'
                    }}
                </template>
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <menu-list @click.stop>
                    <q-item
                        v-for="(action, index) in actions.filter((action) =>
                            action.condition(props.row)
                        )"
                        :key="index"
                        clickable
                        v-close-popup
                    >
                        <q-item-section @click="action.action(props.row)">
                            {{ action.label }}
                        </q-item-section>
                    </q-item>
                </menu-list>
            </q-td>
        </template>
        <template v-slot:item="props">
            <student-item
                :key="props.row.id"
                :student-item="props.row"
                :get-status-color="getStatusColor"
                :check-monthly-payment-paid="checkMonthlyPaymentPaid"
                :handle-send-mail="handleSendMail"
            >
                <template v-slot:menu>
                    <menu-list @click.stop>
                        <q-item
                            v-for="(action, index) in actions.filter((action) =>
                                action.condition(props.row)
                            )"
                            :key="index"
                            clickable
                            v-close-popup
                        >
                            <q-item-section @click="action.action(props.row)">
                                {{ action.label }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </template>
            </student-item>
        </template>
    </q-table>
    <AddActivityAbsenceDialog
        v-if="showModalAddActivityAbsence"
        :id-student="idStudentSelected"
        :activity-absence="activityAbsence"
        @close="showModalAddActivityAbsence = false"
    />
</template>
