<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { ColumnTable } from 'src/types/UtilTypes';

import MenuList from 'src/shared/components/MenuList.vue';

import useBonuses from '../../composables/useBonuses';

const { loading, bonuses, loadBonuses, removeBonus } = useBonuses();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadBonuses();
});

const columnsPass: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('bonus.name'),
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
</script>

<template>
    <div class="row">
        <q-table
            :rows="bonuses"
            :columns="columnsPass"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
            :no-data-label="$t('shared.noData')"
            :rows-per-page-label="$t('shared.recordsPerPage')"
        >
            <template v-slot:top>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
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
            <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                    <q-avatar v-if="props.row.photo">
                        <q-img :ratio="1" :src="props.row.photo" />
                    </q-avatar>
                    <q-avatar
                        v-else
                        color="grey"
                        text-color="white"
                        icon="mdi-image-off"
                    />
                </q-td>
            </template>
            <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                    <div v-for="(role, index) in props.value" :key="index">
                        <q-badge color="green" :label="role" />
                    </div>
                </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <menu-list>
                        <q-item clickable v-close-popup>
                            <q-item-section
                                @click="
                                    $router.push({
                                        name: 'bonuses-edit',
                                        params: { id: props.row.id },
                                    })
                                "
                            >
                                {{ $t('user.label.edit') }}
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section @click="removeBonus(props.row.id)">
                                {{ $t('user.label.delete') }}
                            </q-item-section>
                        </q-item>
                    </menu-list>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
