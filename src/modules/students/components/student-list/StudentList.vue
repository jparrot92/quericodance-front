<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { Student } from '../../models/student';

import useStudents from '../../composables/useStudents';

const {
    loading,
    students,
    loadStudents,
    removeStudent,
    markPaymentPaid,
    cancelPaymentPaid
} = useStudents();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadStudents();
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string | ((row: Student) => string | number | boolean);
    align?: 'left' | 'right' | 'center';
    format?: any;
    sortable?: boolean;
}

const columnsUser: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.label.photo'),
        field: (row: Student) => row.user.photo,
        sortable: false
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: (row: Student) => row.user.name,
        sortable: true
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: (row: Student) => row.user.surnames,
        sortable: true
    },
    {
        name: 'email',
        align: 'left',
        label: t('user.label.email'),
        field: (row: Student) => row.user.email,
        sortable: true
    },
    {
        name: 'active',
        align: 'left',
        label: t('student.label.active'),
        field: (row: Student) => row.active,
        sortable: true
    },
    {
        name: 'monthlyPayment',
        align: 'left',
        label: t('student.label.monthlyPayment'),
        field: (row: Student) => row.monthlyPayment,
        format: (val: number) => `${val} €`,
        sortable: true
    },
    {
        name: 'monthlyPaymentPaid',
        align: 'left',
        label: t('student.label.monthlyPaymentPaid'),
        field: (row: Student) => row.monthlyPaymentPaid,
        sortable: true
    },
    {
        name: 'actions',
        align: 'right',
        label: t('user.label.actions'),
        field: 'actions',
        sortable: false
    }
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
</script>

<template>
    <div class="row">
        <q-table
            :rows="students"
            :columns="columnsUser"
            row-key="id"
            class="col-12"
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
                    :label="$t('student.label.createStudent')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'students-add'
                        })
                    "
                />
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
                <q-td :props="props" class="q-gutter-x-sm">
                    <q-btn
                        icon="mdi-pencil-outline"
                        color="info"
                        dense
                        size="sm"
                        @click="
                            $router.push({
                                name: 'students-edit',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> {{ $t('user.label.edit') }} </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-delete-outline"
                        color="negative"
                        dense
                        size="sm"
                        @click="removeStudent(props.row.id)"
                    >
                        <q-tooltip> {{ $t('user.label.delete') }} </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
