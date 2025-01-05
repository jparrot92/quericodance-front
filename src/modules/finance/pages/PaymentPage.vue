<script setup lang="ts">
import { Ref, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { format } from '@formkit/tempo';
import { ColumnTable } from 'src/types/UtilTypes';

import { PaymentViewDTO } from 'src/model/finance.model';

import usePayments from '../composables/usePayments';
import useStudents from 'src/modules/students/composables/useStudents';

import PaymentItem from '../components/payment-item/PaymentItem.vue';

const { t } = useI18n();
const { isPaymentStatusPaid } = useStudents();
const { loading, payments, loadPayments } = usePayments();

const period: Ref<string> = ref(getCurrentPeriod());

const columnsPayments: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.photo'),
        field: (row: PaymentViewDTO) => row.student?.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: (row: PaymentViewDTO) => row.student?.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.surnames'),
        field: (row: PaymentViewDTO) => row.student?.user.surnames,
        sortable: true,
    },
    {
        name: 'paymentType',
        align: 'left',
        label: t('payment.paymentType'),
        field: 'paymentType',
        sortable: true,
    },
    {
        name: 'paymentMethod',
        align: 'left',
        label: t('payment.paymentMethod'),
        field: 'paymentMethod',
        sortable: true,
    },
    {
        name: 'amount',
        align: 'left',
        label: t('payment.amount'),
        field: 'amount',
        sortable: true,
    },
    {
        name: 'status',
        align: 'left',
        label: t('payment.status'),
        field: 'status',
        sortable: true,
    },
    {
        name: 'paymentDate',
        align: 'left',
        label: t('payment.paymentDate'),
        field: 'paymentDate',
        sortable: true,
    },
];

const periodFormatRegex = /^\d{2}\/\d{4}$/;

watch(
    () => period.value,
    (newPeriod) => {
        if (periodFormatRegex.test(newPeriod)) {
            loadPayments(newPeriod);
        }
    }
);

onMounted(() => {
    loadPayments(period.value);
});

function getCurrentPeriod(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${year}`;
}
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="payments"
        :columns="columnsPayments"
        row-key="id"
        class="col-12"
        :loading="loading"
        :no-data-label="$t('shared.noData')"
        :rows-per-page-label="$t('shared.recordsPerPage')"
    >
        <template v-slot:top>
            <div class="row items-center">
                <pd-date
                    :label="$t('payment.period')"
                    v-model="period"
                    :is-period="true"
                />
            </div>
        </template>
        <template v-slot:body-cell-photo="props">
            <template v-if="props.row.student?.user">
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
        </template>
        <template v-slot:body-cell-name="props">
            <q-td :props="props" :colspan="props.row.student?.user ? 1 : 3">
                <template v-if="props.row.student?.user">
                    {{ props.row.student.user.name }}
                </template>
                <template v-else>
                    <q-badge
                        color="grey"
                        :label="$t('payment.studentRemoved')"
                    />
                </template>
            </q-td>
        </template>
        <template v-slot:body-cell-surnames="props">
            <template v-if="props.row.student?.user">
                <q-td :props="props">
                    {{ props.row.student.user.surnames }}
                </q-td>
            </template>
        </template>
        <template v-slot:body-cell-paymentType="props">
            <q-td :props="props">
                <q-badge
                    color="blue"
                    :label="$t('shared.enum.' + props.row.paymentType)"
                />
            </q-td>
        </template>
        <template v-slot:body-cell-paymentMethod="props">
            <q-td :props="props">
                <q-badge
                    v-if="props.row.paymentMethod"
                    color="blue"
                    :label="$t('shared.enum.' + props.row.paymentMethod)"
                />
            </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
            <q-td :props="props">
                <q-badge
                    :color="
                        isPaymentStatusPaid(props.row.status) ? 'green' : 'red'
                    "
                    :label="`${props.row.amount} €`"
                />
            </q-td>
        </template>
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-badge
                    :color="
                        isPaymentStatusPaid(props.row.status) ? 'green' : 'red'
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
        <template v-slot:item="props">
            <payment-item :key="props.row.id" :payment-item="props.row" />
        </template>
    </q-table>
</template>
