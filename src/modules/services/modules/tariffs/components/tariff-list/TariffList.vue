<script setup lang="ts">
import { ComputedRef, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Action, ColumnTable } from 'src/types/UtilTypes';

import useTariffs from '../../composables/useTariffs';
import { Tariff } from '../../models/tariff';
import TariffItem from '../tariff-item/TariffItem.vue';

const { loading, tariffs, loadTariffs, removeTariff } = useTariffs();

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const actions: ComputedRef<Action<Tariff>[]> = computed(() => {
    return [
        {
            label: t('shared.edit'),
            action: (row: Tariff) => {
                router.push({
                    name: 'tariffs-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: Tariff) => removeTariff(row.id),
            show: () => true,
        },
    ];
});

const columnsTariff: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'sessions',
        align: 'left',
        label: t('tariff.sessions'),
        field: 'sessions',
        sortable: true,
    },
    {
        name: 'sessionFrequency',
        align: 'left',
        label: t('tariff.sessionFrequency'),
        field: (row) => t('shared.enum.' + row.sessionFrequency),
        sortable: true,
    },
    {
        name: 'price',
        align: 'left',
        label: t('tariff.price'),
        field: 'price',
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
    loadTariffs();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="tariffs"
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
                :label="$t('tariff.createTariff')"
                color="primary"
                icon="mdi-plus"
                dense
                @click="
                    $router.push({
                        name: 'tariffs-add',
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
            <tariff-item :key="props.row.id" :tariff-item="props.row">
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </tariff-item>
        </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            v-if="$q.screen.xs"
            fab
            icon="mdi-plus"
            color="primary"
            :to="{ name: 'tariffs-add' }"
        />
    </q-page-sticky>
</template>
