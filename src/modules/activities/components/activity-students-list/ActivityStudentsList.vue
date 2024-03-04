<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { ColumnTable, Option, PaymentsStatus } from 'src/types/UtilTypes';

import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MenuList from 'src/shared/components/MenuList.vue';

import useStudents from 'src/modules/students/composables/useStudents';
import { Student } from 'src/modules/students/models/student';

import useActivities from '../../composables/useActivities';
import { ActivityStudent } from '../../models/activityStudent';

const { t } = useI18n();
const route = useRoute();

const { generateEnumOptions } = useEnumOptions();
const { markPaymentPaid, cancelPaymentPaid } = useStudents();

const { loading, activity, loadStudentsActivity, removeActivityStudent } =
    useActivities();
const { id } = route.params as { id: string };

const paymentStatuses = generateEnumOptions(PaymentsStatus);

onMounted(() => {
    loadStudentsActivity(+id);
});

const columnTable: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.label.photo'),
        field: (row: ActivityStudent) => row.student?.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('user.label.name'),
        field: (row: ActivityStudent) => row.student?.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.label.surnames'),
        field: (row: ActivityStudent) => row.student?.user.surnames,
        sortable: true,
    },
    {
        name: 'phone',
        align: 'left',
        label: t('user.label.phone'),
        field: (row: ActivityStudent) => row.student?.user.phone,
        sortable: true,
    },
    {
        name: 'danceRole',
        align: 'left',
        label: t('student.label.role'),
        field: (row: ActivityStudent) => row.danceRole,
        sortable: true,
    },
    {
        name: 'price',
        align: 'left',
        label: t('activity.label.price'),
        field: (row: ActivityStudent) => row.price || undefined,
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'monthlyPayment',
        align: 'left',
        label: t('student.label.monthlyPayment'),
        field: (row: ActivityStudent) => row.student?.monthlyPayment,
        format: (val: number) => `${val} €`,
        sortable: true,
    },
    {
        name: 'paymentStatus',
        align: 'left',
        label: t('student.label.paymentStatus'),
        field: (row: ActivityStudent) => row.student?.paymentStatus,
        sortable: true,
    },
    {
        name: 'datePayment',
        align: 'left',
        label: t('student.label.datePayment'),
        field: (row: ActivityStudent) => row.student?.datePayment,
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

const deleteActivityStudent = async (idActivityStudent: number) => {
    try {
        await removeActivityStudent(idActivityStudent);
        loadStudentsActivity(+id);
    } catch (error) {
        console.error(error);
    }
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
        student.paymentStatus = PaymentsStatus.PENDING;
    }
};
</script>

<template>
    <div class="row">
        <q-table
            :rows="activity.activitiesStudent"
            :columns="columnTable"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.label.noData')"
            :rows-per-page-label="$t('shared.label.recordsPerPage')"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('activity.label.activity') }} {{ activity.name }}
                    {{ activity.level }} -
                    {{ $t('shared.label.' + activity.day) }}
                    {{ activity.startHour }}
                </span>
                <q-space />

                <!-- <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('student.label.addStudent')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="showModalAddActivity = true"
                /> -->

                <div class="col-12">
                    <div class="row">
                        <div class="col-4">
                            <q-chip color="blue" text-color="white">
                                {{ $t('activity.label.numberLeaders') }} :
                                {{ activity.numberLeaders }}
                            </q-chip>
                        </div>
                        <div class="col-4">
                            <q-chip
                                class="col-4"
                                color="pink"
                                text-color="white"
                            >
                                {{ $t('activity.label.numberFollowers') }} :
                                {{ activity.numberFollowers }}
                            </q-chip>
                        </div>
                        <div class="col-4">
                            <q-chip
                                class="col-4"
                                color="green"
                                text-color="white"
                            >
                                {{ $t('activity.label.costEffectiveness') }} :
                                {{ activity.costEffectiveness + ' €' }}
                            </q-chip>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.student.user.photo">
                        <q-img :ratio="1" :src="props.row.student.user.photo" />
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
                        :color="
                            props.row.student.paymentStatus ===
                                PaymentsStatus.PAYED ||
                            (props.row.student.paymentStatus.value &&
                                props.row.student.paymentStatus.value ===
                                    PaymentsStatus.PAYED)
                                ? 'green'
                                : 'red'
                        "
                        :label="props.value"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-paymentStatus="props">
                <q-td :props="props">
                    <q-select
                        :bg-color="
                            props.row.student.paymentStatus ===
                                PaymentsStatus.PAYED ||
                            (props.row.student.paymentStatus.value &&
                                props.row.student.paymentStatus.value ===
                                    PaymentsStatus.PAYED)
                                ? 'green'
                                : 'red'
                        "
                        v-model="props.row.student.paymentStatus"
                        dense
                        :options="paymentStatuses"
                        @update:model-value="
                            checkMonthlyPaymentPaid(
                                props.row.student,
                                props.row.student.paymentStatus
                            )
                        "
                    >
                        <template v-slot:selected-item="{ opt }">
                            {{ t('shared.enum.' + (opt.value || opt)) }}
                        </template>
                    </q-select>
                </q-td>
            </template>
            <template v-slot:body-cell-datePayment="props">
                <q-td :props="props">
                    {{
                        props.row.student.paymentStatus ===
                            PaymentsStatus.PAYED ||
                        (props.row.student.paymentStatus.value &&
                            props.row.student.paymentStatus.value ===
                                PaymentsStatus.PAYED)
                            ? props.row.student.datePayment
                            : '-'
                    }}
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
                                        params: {
                                            id: props.row.student.id,
                                        },
                                    })
                                "
                            >
                                {{ $t('user.label.edit') }}
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="deleteActivityStudent(props.row.id)"
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
