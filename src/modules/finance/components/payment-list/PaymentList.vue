<script setup lang="ts">
import { onMounted, ref, Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { format } from '@formkit/tempo';
import { ColumnTable } from 'src/types/UtilTypes';

import usePayments from '../../composables/usePayments';
import { PaymentDTO } from '../../models/payment';
import useStudents from 'src/modules/students/composables/useStudents';

const { t } = useI18n();
const { isPaymentStatusPaid } = useStudents();
const { loading, payments, loadPayments } = usePayments();

const columnsPayments: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.photo'),
        field: (row: PaymentDTO) => row.student.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: (row: PaymentDTO) => row.student.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.surnames'),
        field: (row: PaymentDTO) => row.student.user.surnames,
        sortable: true,
    },
    {
        name: 'paymentType',
        align: 'left',
        label: t('finance.paymentType'),
        field: 'paymentType',
        sortable: true,
    },
    {
        name: 'amount',
        align: 'left',
        label: t('finance.amount'),
        field: 'amount',
        sortable: true,
    },
    {
        name: 'status',
        align: 'left',
        label: t('finance.status'),
        field: 'status',
        sortable: true,
    },
    {
        name: 'paymentDate',
        align: 'left',
        label: t('finance.paymentDate'),
        field: 'paymentDate',
        sortable: true,
    },
];

const periodFormatRegex = /^\d{2}\/\d{4}$/;

const period: Ref<string> = ref(getCurrentPeriod());

function getCurrentPeriod(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${year}`;
}

watch(period, (newPeriod) => {
    if (periodFormatRegex.test(newPeriod)) {
        loadPayments(newPeriod);
    }
});

onMounted(() => {
    loadPayments(period.value);
});
</script>

<template>
    <div class="row">
        <q-table
            :rows="payments"
            :columns="columnsPayments"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.noData')"
            :rows-per-page-label="$t('shared.recordsPerPage')"
        >
            <template v-slot:top>
                <pd-date
                    :label="$t('finance.period')"
                    v-model="period"
                    :is-period="true"
                />

                <q-space />
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
            <template v-slot:body-cell-paymentType="props">
                <q-td :props="props">
                    <q-badge
                        color="blue"
                        :label="$t('shared.enum.' + props.row.paymentType)"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-amount="props">
                <q-td :props="props">
                    <q-badge
                        :color="
                            isPaymentStatusPaid(props.row.status)
                                ? 'green'
                                : 'red'
                        "
                        :label="`${props.row.amount} €`"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <q-badge
                        :color="
                            isPaymentStatusPaid(props.row.status)
                                ? 'green'
                                : 'red'
                        "
                        :label="$t('shared.enum.' + props.row.status)"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-paymentDate="props">
                <q-td :props="props">
                    <template v-if="props.row.paymentDate">
                        {{ format(props.row.paymentDate) }}
                    </template>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
