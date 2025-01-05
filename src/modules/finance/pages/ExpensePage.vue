<script setup lang="ts">
import { ComputedRef, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Action, ColumnTable } from 'src/types/UtilTypes';
import { ExpenseDTO } from 'src/model/expense.model';

import useExpenses from '../composables/useExpenses';

import TariffItem from '../components/expense-item/TariffItem.vue';

const { loading, expenses, getExpenses, deleteExpense } = useExpenses();

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const actions: ComputedRef<Action<ExpenseDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.edit'),
            action: (row: ExpenseDTO) => {
                router.push({
                    name: 'expenses-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: ExpenseDTO) => deleteExpense(row.id),
            show: () => true,
        },
    ];
});

const columnsTariff: ColumnTable[] = [
    {
        name: 'description',
        align: 'left',
        label: t('expense.description'),
        field: 'description',
        sortable: true,
    },
    {
        name: 'amount',
        align: 'left',
        label: t('expense.amount'),
        field: 'amount',
        sortable: true,
    },
    {
        name: 'expenseDate',
        align: 'left',
        label: t('expense.expenseDate'),
        field: 'expenseDate',
        sortable: true,
    },
    {
        name: 'actions',
        align: 'center',
        label: '',
        field: 'actions',
        sortable: false,
    },
];

onMounted(() => {
    getExpenses();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="expenses"
        :columns="columnsTariff"
        row-key="id"
        class="col-12 my-sticky-last-column-table"
        :loading="loading"
        :no-data-label="$t('shared.noData')"
        :rows-per-page-label="$t('shared.recordsPerPage')"
    >
        <template v-slot:top v-if="!$q.screen.xs">
            <q-space />
            <q-btn
                :label="$t('expense.createExpense')"
                color="primary"
                icon="mdi-plus"
                dense
                @click="
                    $router.push({
                        name: 'expenses-add',
                    })
                "
            />
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <pd-menu-list :actions="actions" :row="props.row" />
            </q-td>
        </template>
        <template v-slot:item="props">
            <expense-item :key="props.row.id" :expense-item="props.row">
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </expense-item>
        </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            v-if="$q.screen.xs"
            fab
            icon="mdi-plus"
            color="primary"
            :to="{ name: 'expenses-add' }"
        />
    </q-page-sticky>
</template>
