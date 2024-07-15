<script setup lang="ts">
import { ref, onMounted, computed, Ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { format } from '@formkit/tempo';

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

import { Student } from '../../models/student';

import useStudents from '../../composables/useStudents';

import { FilterField } from 'src/composables/useFilterTypes';
import { reactive } from 'vue';

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
const studentsFiltered = ref<Student[]>();
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
        field: (row: Student) => row.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: (row: Student) => row.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: (row: Student) => row.user.surnames,
        sortable: true,
    },
    {
        name: 'phone',
        align: 'left',
        label: t('user.label.phone'),
        field: (row: Student) => row.user.phone,
        sortable: true,
    },
    {
        name: 'status',
        align: 'left',
        label: t('student.label.state'),
        field: (row: Student) => row.status,
        sortable: true,
    },
    {
        name: 'danceRole',
        align: 'left',
        label: t('student.label.role'),
        field: (row: Student) => row.activitiesStudent[0].danceRole,
        sortable: true,
    },
    {
        name: 'payment',
        align: 'left',
        label: t('student.label.monthlyPayment'),
        field: (row: Student) => row.membership?.payment,
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'paymentStatus',
        align: 'left',
        label: t('student.label.paymentStatus'),
        field: (row: Student) => row.membership?.paymentStatus,
        sortable: true,
    },
    {
        name: 'mail',
        align: 'left',
        label: t('student.label.confirmationPayment'),
        field: 'mail',
        sortable: false,
    },
    {
        name: 'datePayment',
        align: 'left',
        label: t('student.label.datePayment'),
        field: (row: Student) => row.membership?.paymentDate,
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
    query: '',
    status: null,
    paymentStatus: null,
    danceRole: null,
});

const filters: Ref<Array<FilterField>> = ref([] as Array<FilterField>);

const filterTable = () => {
    studentsFiltered.value = students.value
        .filter((student: Student) => {
            const studentFullName =
                student.user.name.toLowerCase() +
                student.user.surnames.toLowerCase() +
                student.user.email.toLowerCase();

            return studentFullName.includes(
                filtersSelected.query.replace(/\s/g, '').toLowerCase()
            );
        })
        .filter((student: Student) => {
            if (filtersSelected.status === null) {
                return true;
            } else {
                return student.status === filtersSelected.status;
            }
        })
        .filter((student: Student) => {
            if (filtersSelected.paymentStatus === null) {
                return true;
            } else {
                return (
                    student.membership?.paymentStatus ===
                    filtersSelected.paymentStatus
                );
            }
        })
        .filter((student: Student) => {
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

const onRowClick = (evt: Event, row: Student) => {
    router.push({
        name: 'students-edit',
        params: {
            id: row.id,
        },
    });
};

const checkMonthlyPaymentPaid = async (
    student: Student,
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

const handleSendMail = async (student: Student) => {
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

watch(
    filtersSelected,
    () => {
        if ($q.platform.is.desktop) {
            filterTable();
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
});
</script>

<template>
    <div class="row" v-if="$q.platform.is.desktop">
        <q-table
            :rows="studentsFiltered"
            :columns="columnsFiltered"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            @row-click="onRowClick"
            :no-data-label="$t('shared.noData')"
            :rows-per-page-label="$t('shared.recordsPerPage')"
        >
            <template v-slot:top>
                <div class="col-12 justify-between">
                    <div class="row justify-between">
                        <div :class="idActivity ? 'col-8' : 'col-6'">
                            <pd-filter
                                v-model="filtersSelected"
                                :filters="filters"
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
                                    :label="$t('student.label.createStudent')"
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
                                    class="q-ml-sm h-2rem"
                                    :label="$t('shared.resetPayments')"
                                    color="green"
                                    icon="mdi-restart"
                                    dense
                                    @click="handleResetPayments"
                                />
                            </div>
                            <div class="col-2 flex justify-end">
                                <q-btn
                                    :label="$t('shared.importExcel')"
                                    color="green"
                                    icon="file_present"
                                    dense
                                    class="h-2rem"
                                    @click="chooseFile"
                                />
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
                                    :label="$t('student.label.createStudent')"
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
            <template v-slot:body-cell-active="props">
                <q-td :props="props">
                    <q-badge
                        :color="props.row.active ? 'green' : 'red'"
                        :label="
                            props.row.active
                                ? $t('student.label.active')
                                : $t('student.label.inactivo')
                        "
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
                            isPaymentStatusPaid(
                                props.row.membership?.paymentStatus
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
                            :label="$t('student.label.send')"
                            @click="handleSendMail(props.row)"
                        />
                    </template>
                </q-td>
            </template>
            <template v-slot:body-cell-datePayment="props">
                <q-td :props="props">
                    <template v-if="props.row.membership">
                        {{
                            isPaymentStatusPaid(
                                props.row.membership?.paymentStatus
                            )
                                ? format(props.row.membership.datePayment)
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
                                @click="removeStudent(props.row.id)"
                            >
                                {{ $t('user.label.delete') }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
    <div class="row" v-if="$q.platform.is.mobile">
        <q-table
            :rows="studentsFiltered"
            :columns="columnsFiltered"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            @row-click="onRowClick"
            :no-data-label="$t('shared.noData')"
            :rows-per-page-label="$t('shared.recordsPerPage')"
            grid
            hide-pagination
        >
            <template v-slot:top>
                <div class="col-12">
                    <pd-filter
                        v-model="filtersSelected"
                        :filters="filters"
                    ></pd-filter>
                </div>

                {{ filtersSelected }}
            </template>

            <template v-slot:item="props">
                <transition-group
                    appear
                    enter-active-class="animated fadeInLeft"
                    leave-active-class="animated fadeOutRight"
                >
                    <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3" key="card">
                        <q-item class="q-mb-sm" clickable v-ripple:primary>
                            <q-item-section avatar>
                                <q-avatar v-if="props.row.user.photo">
                                    <q-img
                                        :ratio="1"
                                        :src="props.row.user.photo"
                                    />
                                </q-avatar>
                                <q-avatar
                                    v-else
                                    color="grey"
                                    text-color="white"
                                    icon="mdi-image-off"
                                />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>
                                    {{ props.row.user.name }}
                                    {{ props.row.user.surnames }}
                                </q-item-label>
                                <q-item-label caption lines="1">
                                    {{ props.row.user.name }}
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <div class="text-grey-8 q-gutter-xs">
                                    <q-btn
                                        size="12px"
                                        flat
                                        dense
                                        round
                                        icon="more_vert"
                                    />
                                </div>
                            </q-item-section>
                        </q-item>
                    </div>
                </transition-group>
            </template>
        </q-table>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                fab
                icon="mdi-plus"
                color="primary"
                :to="{ name: 'students-add' }"
            />
        </q-page-sticky>
    </div>
</template>
