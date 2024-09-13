<script setup lang="ts">
import { ref, onMounted, computed, Ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { format } from '@formkit/tempo';
import { reactive } from 'vue';
import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';

import {
    ColumnTable,
    DanceRole,
    Option,
    PaymentsStatus,
    Status,
} from 'src/types/UtilTypes';

import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MenuList from 'src/shared/components/MenuList.vue';

import useActivities from 'src/modules/activities/composables/useActivities';
import useStudents from '../../composables/useStudents';

import { UserViewDTO } from '../../models/user';
import { FilterField } from 'src/composables/useFilterTypes';

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
    resetPayments,
    isPaymentStatusPaid,
    handleFileUpload,
    handleFileDownload,
    handleFileDownloadTemplate,
} = useStudents();

const { activityCounters, loadCountersActivity } = useActivities();

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const states = generateEnumOptions(Status);
const paymentStatuses = generateEnumOptions(PaymentsStatus);
const danceRoles = generateEnumOptions(DanceRole);

const fileInput = ref<HTMLInputElement | null>(null);
const studentsFiltered = ref<UserViewDTO[]>([]);
const showProfitability = ref(false);

const idActivity = computed<string>(() => route.params.id?.toString());

const columnsFiltered = computed(() => {
    if (!idActivity.value) {
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
        label: t('user.label.photo'),
        field: 'photo',
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: 'surnames',
        sortable: true,
    },
    {
        name: 'phone',
        align: 'left',
        label: t('user.label.phone'),
        field: 'phone',
        sortable: true,
    },
    {
        name: 'status',
        align: 'left',
        label: t('student.state'),
        field: (row: UserViewDTO) => row.student.status,
        sortable: true,
    },
    {
        name: 'danceRole',
        align: 'left',
        label: t('student.role'),
        field: (row: UserViewDTO) => row.student.activitiesStudent[0].danceRole,
        sortable: true,
    },
    {
        name: 'payment',
        align: 'left',
        label: t('student.monthlyPayment'),
        field: (row: UserViewDTO) => row.student.membership?.payment,
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'paymentStatus',
        align: 'left',
        label: t('student.paymentStatus'),
        field: (row: UserViewDTO) => row.student.membership?.paymentStatus,
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
        field: (row: UserViewDTO) => row.student.membership?.paymentDate,
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
    id: idActivity.value ? 'activity' : 'student',
    query: '',
    status: null,
    paymentStatus: null,
    danceRole: null,
    pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
    },
});

loadFiltersFromLocalStorage(filtersSelected);

const filters: Ref<Array<FilterField>> = ref([] as Array<FilterField>);

const filterTable = () => {
    studentsFiltered.value = students.value
        .filter((user: UserViewDTO) => {
            const studentFullName =
                user.name.toLowerCase() +
                user.surnames.toLowerCase() +
                user.email.toLowerCase();

            return studentFullName.includes(
                filtersSelected.query.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((user: UserViewDTO) => {
            if (filtersSelected.status === null) {
                return true;
            } else {
                return user.student.status === filtersSelected.status;
            }
        })
        .filter((user: UserViewDTO) => {
            if (filtersSelected.paymentStatus === null) {
                return true;
            } else {
                return (
                    user.student.membership?.paymentStatus ===
                    filtersSelected.paymentStatus
                );
            }
        })
        .filter((user: UserViewDTO) => {
            if (
                filtersSelected.danceRole === null ||
                filtersSelected.danceRole === undefined
            ) {
                return true;
            } else {
                return (
                    user.student.activitiesStudent[0].danceRole ===
                    filtersSelected.danceRole
                );
            }
        });
};

const onRowClick = (evt: Event, row: UserViewDTO) => {
    router.push({
        name: 'students-edit',
        params: {
            id: row.student?.id,
        },
    });
};

const checkMonthlyPaymentPaid = async (
    student: UserViewDTO,
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

const handleSendMail = async (student: UserViewDTO) => {
    sendMailPaymentPaid(student.id);
};

const handleResetPayments = async () => {
    try {
        await resetPayments();
        await loadStudents(idActivity.value);
        studentsFiltered.value = students.value;
    } catch (error) {
        console.error(error);
    }
};

const chooseFile = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const handleRemoveStudent = async (id: number) => {
    try {
        await removeStudent(id);
        const index = studentsFiltered.value?.findIndex(
            (student: UserViewDTO) => student.id === id
        );
        if (index !== undefined && index !== -1) {
            studentsFiltered.value?.splice(index, 1);
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
    filters.value = [
        {
            field: 'paymentStatus',
            label: t('student.paymentStatus'),
            options: paymentStatuses,
        },
    ] as Array<FilterField>;

    if (idActivity.value) {
        filters.value.push({
            field: 'danceRole',
            label: t('student.danceRole'),
            options: danceRoles,
        });

        await loadCountersActivity(idActivity.value);
    } else {
        filters.value.push({
            field: 'status',
            label: t('student.status'),
            options: states,
        });
    }
    await loadStudents(idActivity.value);
    studentsFiltered.value = students.value;
    filterTable();
});
</script>

<template>
    <div class="row">
        <q-table
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
                        <div :class="idActivity ? 'col-8' : 'col-6'">
                            <pd-filter
                                v-model="filtersSelected"
                                :filters="filters"
                                :placeholder="$t('student.serachPlaceholder')"
                            ></pd-filter>
                        </div>
                        <template v-if="idActivity">
                            <div class="col-2 flex justify-end">
                                <q-toggle
                                    class="h-2rem"
                                    :label="
                                        $t('activity.label.showProfitability')
                                    "
                                    v-model="showProfitability"
                                ></q-toggle>
                            </div>
                            <div class="col-2 flex justify-end">
                                <q-btn
                                    :label="$t('student.createStudent')"
                                    color="primary"
                                    icon="mdi-plus"
                                    dense
                                    class="h-2rem"
                                    @click="
                                        $router.push({
                                            name: 'students-add',
                                        })
                                    "
                                />
                            </div>
                        </template>
                        <template v-else>
                            <div class="col-2 flex justify-end">
                                <q-btn
                                    class="h-2rem"
                                    :label="$t('shared.resetPayments')"
                                    color="green"
                                    icon="mdi-restart"
                                    dense
                                    @click="handleResetPayments"
                                />
                            </div>
                            <div class="col-2 flex justify-center">
                                <q-btn-dropdown
                                    :label="$t('shared.excel')"
                                    color="green"
                                    icon="file_present"
                                    dense
                                    class="h-2rem"
                                >
                                    <q-list>
                                        <q-item
                                            clickable
                                            v-close-popup
                                            @click="handleFileDownloadTemplate"
                                        >
                                            <q-item-section>
                                                <q-item-label>
                                                    {{
                                                        $t(
                                                            'shared.downloadExcelTemplate'
                                                        )
                                                    }}
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item
                                            clickable
                                            v-close-popup
                                            @click="chooseFile"
                                        >
                                            <q-item-section>
                                                <q-item-label>
                                                    {{
                                                        $t('shared.importExcel')
                                                    }}
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item
                                            clickable
                                            v-close-popup
                                            @click="handleFileDownload"
                                        >
                                            <q-item-section>
                                                <q-item-label>
                                                    {{
                                                        $t(
                                                            'shared.downloadExcel'
                                                        )
                                                    }}
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-btn-dropdown>
                                <input
                                    type="file"
                                    ref="fileInput"
                                    accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    @change="handleFileUpload"
                                    style="display: none"
                                />
                            </div>
                            <div class="col-2 flex justify-end">
                                <q-btn
                                    class="h-2rem"
                                    :label="$t('student.createStudent')"
                                    color="primary"
                                    icon="mdi-plus"
                                    dense
                                    @click="
                                        $router.push({
                                            name: 'students-add',
                                        })
                                    "
                                />
                            </div>
                        </template>
                    </div>
                </div>

                <div class="col-12" v-if="idActivity">
                    <div class="row">
                        <div class="col-4">
                            <q-chip color="blue" text-color="white">
                                {{ $t('activity.label.numberLeaders') }} :
                                {{ activityCounters.numberLeaders }}
                            </q-chip>
                        </div>
                        <div class="col-4">
                            <q-chip
                                class="col-4"
                                color="pink"
                                text-color="white"
                            >
                                {{ $t('activity.label.numberFollowers') }} :
                                {{ activityCounters.numberFollowers }}
                            </q-chip>
                        </div>
                        <template v-if="showProfitability">
                            <div class="col-4">
                                <q-chip
                                    class="col-4"
                                    color="green"
                                    text-color="white"
                                >
                                    {{ $t('activity.label.costEffectiveness') }}
                                    :
                                    {{
                                        activityCounters.costEffectiveness +
                                        ' €'
                                    }}
                                </q-chip>
                            </div>
                            <div class="col-4">
                                <q-chip
                                    class="col-4"
                                    color="green"
                                    text-color="white"
                                >
                                    {{ $t('activity.label.totalPaid') }}
                                    :
                                    {{ activityCounters.totalPaid + ' €' }}
                                </q-chip>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.photo">
                        <q-img :ratio="1" :src="props.row.photo" />
                    </q-avatar>
                    <q-avatar
                        v-else
                        color="grey"
                        text-color="white"
                        icon="mdi-image-off"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-phone="props">
                <q-td :props="props">
                    <a
                        @click.stop
                        :href="'https://wa.me/' + props.row.phone"
                        target="_blank"
                    >
                        {{ props.row.phone }}
                    </a>
                </q-td>
            </template>
            <template v-slot:body-cell-active="props">
                <q-td :props="props">
                    <q-badge
                        :color="props.row.active ? 'green' : 'red'"
                        :label="
                            props.row.active
                                ? $t('student.active')
                                : $t('student.inactivo')
                        "
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-payment="props">
                <q-td :props="props">
                    <q-badge
                        v-if="props.row.student.membership"
                        :color="
                            isPaymentStatusPaid(
                                props.row.student.membership?.paymentStatus
                            )
                                ? 'green'
                                : 'red'
                        "
                        :label="props.value"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-paymentStatus="props">
                <q-td :props="props" @click.stop>
                    <template v-if="props.row.student.membership">
                        <q-select
                            :bg-color="
                                isPaymentStatusPaid(
                                    props.row.student.membership.paymentStatus
                                )
                                    ? 'green'
                                    : 'red'
                            "
                            v-model="props.row.student.membership.paymentStatus"
                            rounded
                            outlined
                            dense
                            options-dense
                            :options="paymentStatuses"
                            @update:model-value="
                                checkMonthlyPaymentPaid(
                                    props.row,
                                    props.row.student.membership.paymentStatus
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
                    <template v-if="props.row.student.membership">
                        <q-btn
                            v-if="
                                props.row.student.membership?.paymentStatus &&
                                isPaymentStatusPaid(
                                    props.row.student.membership.paymentStatus
                                )
                            "
                            color="primary"
                            rounded
                            size="md"
                            :label="$t('student.send')"
                            @click="handleSendMail(props.row)"
                        />
                    </template>
                </q-td>
            </template>
            <template v-slot:body-cell-datePayment="props">
                <q-td :props="props">
                    <template v-if="props.row.student.membership">
                        {{
                            isPaymentStatusPaid(
                                props.row.student.membership?.paymentStatus
                            )
                                ? format(
                                      props.row.student.membership.datePayment
                                  )
                                : '-'
                        }}
                    </template>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <menu-list @click.stop>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="
                                    $router.push({
                                        name: 'students-edit',
                                        params: { id: props.row.id },
                                    })
                                "
                            >
                                {{ $t('user.label.edit') }}
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="handleRemoveStudent(props.row.id)"
                            >
                                {{ $t('user.label.delete') }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
