<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { format } from '@formkit/tempo';

import { ColumnTable, Option, PaymentsStatus } from 'src/types/UtilTypes';

import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MenuList from 'src/shared/components/MenuList.vue';

import useStudents from 'src/modules/students/composables/useStudents';
import { Student, StudentFilter } from 'src/modules/students/models/student';

import useActivities from '../../composables/useActivities';
import { ActivityStudent } from '../../models/activityStudent';

import ActivityStudentsListFilter from '../activity-students-list-filter/ActivityStudentsListFilter.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const { generateEnumOptions } = useEnumOptions();
const {
    markPaymentPaid,
    cancelPaymentPaid,
    isPaymentStatusPaid,
    sendMailPaymentPaid,
} = useStudents();

const {
    loading,
    activity,
    activityCounters,
    loadStudentsActivity,
    loadCountersActivity,
    removeActivityStudent,
} = useActivities();
const { id } = route.params as { id: string };

const paymentStatuses = generateEnumOptions(PaymentsStatus);
const activityStudentFilter = ref<ActivityStudent[]>();
const showProfitability = ref(false);

const filterTable = (studentFilter: StudentFilter) => {
    if (activity?.value?.activitiesStudent) {
        activityStudentFilter.value = activity.value.activitiesStudent
            .filter((activityStudent: ActivityStudent) => {
                const studentFullName =
                    (activityStudent.student?.user.name ?? '').toLowerCase() +
                    (
                        activityStudent.student?.user.surnames ?? ''
                    ).toLowerCase() +
                    (activityStudent.student?.user.email ?? '').toLowerCase();

                return studentFullName.includes(
                    studentFilter.textFilter.replace(/\s/g, '').toLowerCase()
                );
            })
            .filter((activityStudent: ActivityStudent) => {
                if (studentFilter.paymentStatus === null) {
                    return true;
                } else {
                    return (
                        activityStudent.student?.paymentStatus ===
                        studentFilter.paymentStatus.value
                    );
                }
            })
            .filter((activityStudent: ActivityStudent) => {
                if (
                    studentFilter.danceRole === null ||
                    studentFilter.danceRole === undefined
                ) {
                    return true;
                } else {
                    return (
                        activityStudent.danceRole ===
                        studentFilter.danceRole.value
                    );
                }
            });
    }
};

const filteredColumns = computed(() => {
    if (showProfitability.value) {
        return columns;
    } else {
        return columns.filter(
            (column) =>
                column.name !== 'price' && column.name !== 'monthlyPayment'
        );
    }
});

onMounted(async () => {
    await loadCountersActivity(+id);
    await loadStudentsActivity(+id);
    activityStudentFilter.value = activity.value.activitiesStudent;
});

const columns: ColumnTable[] = [
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

const onRowClick = (evt: Event, row: ActivityStudent) => {
    router.push({
        name: 'students-edit',
        params: {
            id: row.student?.id,
        },
    });
};

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
        await loadCountersActivity(+id);
    } catch (error) {
        student.paymentStatus = PaymentsStatus.PENDING;
    }
};

const handleSendMail = async (student: Student) => {
    sendMailPaymentPaid(student.id);
};
</script>

<template>
    <div class="row">
        <q-table
            :rows="activityStudentFilter"
            :columns="filteredColumns"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            @row-click="onRowClick"
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
                <q-toggle
                    :label="$t('activity.label.showProfitability')"
                    v-model="showProfitability"
                ></q-toggle>

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
                <ActivityStudentsListFilter @filter-table="filterTable" />
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
            <template v-slot:body-cell-phone="props">
                <q-td :props="props">
                    <a
                        @click.stop
                        :href="
                            'https://wa.me/34' + props.row.student.user.phone
                        "
                        target="_blank"
                    >
                        {{ props.row.student.user.phone }}
                    </a>
                </q-td>
            </template>
            <template v-slot:body-cell-monthlyPayment="props">
                <q-td :props="props">
                    <q-badge
                        :color="
                            isPaymentStatusPaid(props.row.student.paymentStatus)
                                ? 'green'
                                : 'red'
                        "
                        :label="props.value"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-paymentStatus="props">
                <q-td :props="props" @click.stop>
                    <q-select
                        :bg-color="
                            isPaymentStatusPaid(props.row.student.paymentStatus)
                                ? 'green'
                                : 'red'
                        "
                        v-model="props.row.student.paymentStatus"
                        rounded
                        outlined
                        dense
                        options-dense
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
            <template v-slot:body-cell-mail="props">
                <q-td :props="props" @click.stop>
                    <q-btn
                        v-if="
                            isPaymentStatusPaid(props.row.student.paymentStatus)
                        "
                        color="primary"
                        rounded
                        size="md"
                        :label="$t('student.label.send')"
                        @click="handleSendMail(props.row.student)"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-datePayment="props">
                <q-td :props="props">
                    {{
                        isPaymentStatusPaid(props.row.student.paymentStatus)
                            ? format(props.row.student.datePayment)
                            : '-'
                    }}
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
