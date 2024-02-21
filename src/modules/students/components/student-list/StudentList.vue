<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import MenuList from 'src/shared/components/MenuList.vue';

import { Student } from '../../models/student';

import useStudents from '../../composables/useStudents';

const {
    loading,
    students,
    loadStudents,
    removeStudent,
    markPaymentPaid,
    cancelPaymentPaid,
    handleFileUpload,
} = useStudents();

const $q = useQuasar();

const { t } = useI18n();

const fileInput = ref<HTMLInputElement | null>(null);
const search = ref<string>('');
const filteredStudents = ref<Student[]>();

const filterTable = () => {
    filteredStudents.value = students.value.filter((student) => {
        return (
            student.user.name
                .toLowerCase()
                .includes(search.value.toLowerCase()) ||
            student.user.surnames
                .toLowerCase()
                .includes(search.value.toLowerCase()) ||
            student.user.email
                .toLowerCase()
                .includes(search.value.toLowerCase())
        );
    });
};

onMounted(async () => {
    await loadStudents();
    filteredStudents.value = students.value;
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string | ((row: Student) => string | number | boolean);
    align?: 'left' | 'right' | 'center';
    format?: (val: number) => string;
    sortable?: boolean;
}

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
        label: t('student.label.active'),
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
        name: 'monthlyPaymentPaid',
        align: 'left',
        label: t('student.label.monthlyPaymentPaid'),
        field: (row: Student) => row.monthlyPaymentPaid,
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
    monthlyPaymentPaid: boolean
) => {
    try {
        if (monthlyPaymentPaid) {
            await markPaymentPaid(student.id);
        } else {
            await cancelPaymentPaid(student.id);
        }
    } catch (error) {
        student.monthlyPaymentPaid = !monthlyPaymentPaid;
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
            :rows="filteredStudents"
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

                <div class="col-12">
                    <q-input
                        v-model="search"
                        dense
                        placeholder="Search..."
                        @update:model-value="filterTable"
                    />
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
            <template v-slot:body-cell-monthlyPayment="props">
                <q-td :props="props">
                    <q-badge
                        :color="props.row.monthlyPaymentPaid ? 'green' : 'red'"
                        :label="props.value"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-monthlyPaymentPaid="props">
                <q-td :props="props">
                    <q-toggle
                        :label="
                            props.row.monthlyPaymentPaid
                                ? $t('student.label.paid')
                                : $t('student.label.unpaid')
                        "
                        color="green"
                        v-model="props.row.monthlyPaymentPaid"
                        @click="
                            checkMonthlyPaymentPaid(
                                props.row,
                                props.row.monthlyPaymentPaid
                            )
                        "
                    />
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
