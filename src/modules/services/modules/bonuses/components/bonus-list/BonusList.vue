<script setup lang="ts">
import { ComputedRef, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Action, ColumnTable } from 'src/types/UtilTypes';

import useBonuses from '../../composables/useBonuses';
import { Bonus } from '../../models/bonus';
import BonusItem from '../bonus-item/BonusItem.vue';

const { loading, bonuses, loadBonuses, removeBonus } = useBonuses();

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const actions: ComputedRef<Action<Bonus>[]> = computed(() => {
    return [
        {
            label: t('shared.edit'),
            action: (row: Bonus) => {
                router.push({
                    name: 'bonuses-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: Bonus) => removeBonus(row.id),
            show: () => true,
        },
    ];
});

const columnsBonus: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('shared.name'),
        field: 'name',
        sortable: false,
    },
    {
        name: 'sessions',
        align: 'left',
        label: t('bonus.sessions'),
        field: 'sessions',
        sortable: true,
    },
    {
        name: 'price',
        align: 'left',
        label: t('bonus.price'),
        field: 'price',
        sortable: false,
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
    loadBonuses();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="bonuses"
        :columns="columnsBonus"
        row-key="id"
        class="col-12 my-sticky-last-column-table"
        :loading="loading"
        :no-data-label="$t('shared.noData')"
        :rows-per-page-label="$t('shared.recordsPerPage')"
    >
        <template v-slot:top v-if="!$q.screen.xs">
            <q-space />
            <q-btn
                :label="$t('bonus.createBonus')"
                color="primary"
                icon="mdi-plus"
                dense
                @click="
                    $router.push({
                        name: 'bonuses-add',
                    })
                "
            />
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <menu-list>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </menu-list>
            </q-td>
        </template>
        <template v-slot:item="props">
            <bonus-item :key="props.row.id" :bonus-item="props.row">
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </bonus-item>
        </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            v-if="$q.screen.xs"
            fab
            icon="mdi-plus"
            color="primary"
            :to="{ name: 'bonuses-add' }"
        />
    </q-page-sticky>
</template>
