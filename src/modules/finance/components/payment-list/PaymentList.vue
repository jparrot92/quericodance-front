<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { format } from '@formkit/tempo';
import { ColumnTable } from 'src/types/UtilTypes';

import usePayments from '../../composables/usePayments';
import { PaymentDTO } from '../../models/payment';
import useStudents from 'src/modules/students/composables/useStudents';

const props = withDefaults(
    defineProps<{
        period: string;
    }>(),
    {}
);

const { t } = useI18n();
const { isPaymentStatusPaid } = useStudents();
const { loading, payments, loadPayments } = usePayments();

const columnsPayments: ColumnTable[] = [
    {
        name: 'photo',
        align: 'left',
        label: t('user.photo'),
        field: (row: PaymentDTO) => row.student?.user.photo,
        sortable: false,
    },
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: (row: PaymentDTO) => row.student?.user.name,
        sortable: true,
    },
    {
        name: 'surnames',
        align: 'left',
        label: t('user.surnames'),
        field: (row: PaymentDTO) => row.student?.user.surnames,
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

watch(
    () => props.period,
    (newPeriod) => {
        if (periodFormatRegex.test(newPeriod)) {
            loadPayments(newPeriod);
        }
    }
);

onMounted(() => {
    loadPayments(props.period);
});
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
                        :label="$t('finance.studentRemoved')"
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
    </q-table>
</template>
