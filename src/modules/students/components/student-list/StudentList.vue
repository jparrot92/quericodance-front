<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { ColumnTable, Option, PaymentsStatus } from 'src/types/UtilTypes';

import MenuList from 'src/shared/components/MenuList.vue';

import { Student, StudentFilter } from '../../models/student';

import useEnumOptions from 'src/shared/composables/useEnumOptions';
import useStudents from '../../composables/useStudents';

import StudentListFilter from '../../components/student-list-filter/StudentListFilter.vue';

const { generateEnumOptions } = useEnumOptions();
const {
    loading,
    students,
    loadStudents,
    removeStudent,
    markPaymentPaid,
    cancelPaymentPaid,
    resetPayments,
    handleFileUpload,
} = useStudents();

const $q = useQuasar();

const { t } = useI18n();

const fileInput = ref<HTMLInputElement | null>(null);
const paymentStatuses = generateEnumOptions(PaymentsStatus);
const studentsFilter = ref<Student[]>();

const filterTable = (studentFilter: StudentFilter) => {
    studentsFilter.value = students.value
        .filter((student: Student) => {
            return (
                student.user.name
                    .toLowerCase()
                    .includes(studentFilter.textFilter.toLowerCase()) ||
                student.user.surnames
                    .toLowerCase()
                    .includes(studentFilter.textFilter.toLowerCase()) ||
                student.user.email
                    .toLowerCase()
                    .includes(studentFilter.textFilter.toLowerCase())
            );
        })
        .filter((student: Student) => {
            if (studentFilter.paymentStatus === null) {
                return true;
            } else {
                return (
                    student.paymentStatus === studentFilter.paymentStatus.value
                );
            }
        });
};

onMounted(async () => {
    await loadStudents();
    studentsFilter.value = students.value;
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
        name: 'email',
        align: 'left',
        label: t('user.label.email'),
        field: (row: Student) => row.user.email,
        sortable: true,
    },
    {
        name: 'active',
        align: 'left',
        label: t('student.label.state'),
        field: (row: Student) => row.user.active,
        sortable: true,
    },
    {
        name: 'monthlyPayment',
        align: 'left',
        label: t('student.label.monthlyPayment'),
        field: (row: Student) => row.monthlyPayment,
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'paymentStatus',
        align: 'left',
        label: t('student.label.paymentStatus'),
        field: (row: Student) => row.paymentStatus,
        sortable: true,
    },
    {
        name: 'datePayment',
        align: 'left',
        label: t('student.label.datePayment'),
        field: (row: Student) => row.datePayment,
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
        student.paymentStatus = PaymentsStatus.PENDING;
    }
};

const handleResetPayments = async () => {
    try {
        await resetPayments();
        await loadStudents();
        studentsFilter.value = students.value;
    } catch (error) {
        console.error(error);
    }
};

const chooseFile = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};
</script>

<template>
    <div class="row">
        <q-table
            :rows="studentsFilter"
            :columns="columnsUser"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.label.noData')"
            :rows-per-page-label="$t('shared.label.recordsPerPage')"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('student.label.students') }}
                </span>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    class="q-ml-sm"
                    :label="$t('shared.label.resetPayments')"
                    color="green"
                    icon="mdi-restart"
                    dense
                    @click="handleResetPayments"
                />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    class="q-ml-sm"
                    :label="$t('shared.label.importExcel')"
                    color="green"
                    icon="file_present"
                    dense
                    @click="chooseFile"
                />
                <input
                    type="file"
                    ref="fileInput"
                    accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    @change="handleFileUpload"
                    style="display: none"
                />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    class="q-ml-sm"
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

                <StudentListFilter @filter-table="filterTable" />
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
            <template v-slot:body-cell-monthlyPayment="props">
                <q-td :props="props">
                    <q-badge
                        :color="
                            props.row.paymentStatus === PaymentsStatus.PAYED ||
                            (props.row.paymentStatus.value &&
                                props.row.paymentStatus.value ===
                                    PaymentsStatus.PAYED)
                                ? 'green'
                                : 'red'
                        "
                        :label="props.value"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-datePayment="props">
                <q-td :props="props">
                    {{
                        props.row.paymentStatus === PaymentsStatus.PAYED ||
                        (props.row.paymentStatus.value &&
                            props.row.paymentStatus.value ===
                                PaymentsStatus.PAYED)
                            ? props.row.datePayment
                            : '-'
                    }}
                </q-td>
            </template>
            <template v-slot:body-cell-paymentStatus="props">
                <q-td :props="props">
                    <q-select
                        :bg-color="
                            props.row.paymentStatus === PaymentsStatus.PAYED ||
                            (props.row.paymentStatus.value &&
                                props.row.paymentStatus.value ===
                                    PaymentsStatus.PAYED)
                                ? 'green'
                                : 'red'
                        "
                        v-model="props.row.paymentStatus"
                        dense
                        :options="paymentStatuses"
                        @update:model-value="
                            checkMonthlyPaymentPaid(
                                props.row,
                                props.row.paymentStatus
                            )
                        "
                    >
                        <template v-slot:selected-item="{ opt }">
                            {{ t('shared.enum.' + (opt.value || opt)) }}
                        </template>
                    </q-select>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <menu-list>
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
</template>
