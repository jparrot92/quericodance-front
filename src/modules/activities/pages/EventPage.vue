<script setup lang="ts">
import { ComputedRef, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Action, ColumnTable } from 'src/types/UtilTypes';

import { EventDTO } from 'src/model/activity.model';

import useEvents from '../composables/useEvents';

const { loading, events, getEvents, deleteEvent } = useEvents();

const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const actions: ComputedRef<Action<EventDTO>[]> = computed(() => {
    return [
        {
            label: t('shared.edit'),
            action: (row: EventDTO) => {
                router.push({
                    name: 'events-edit',
                    params: { id: row.id },
                });
            },
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: EventDTO) => deleteEvent(row.id),
            show: () => true,
        },
    ];
});

const columnsEvent: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('event.name'),
        field: 'name',
        sortable: true,
    },
    {
        name: 'dateEvent',
        align: 'left',
        label: t('event.dateEvent'),
        field: 'dateEvent',
        sortable: true,
    },
    {
        name: 'startHour',
        align: 'left',
        label: t('event.startHour'),
        field: 'startHour',
        sortable: true,
    },
    {
        name: 'endHour',
        align: 'left',
        label: t('event.endHour'),
        field: 'endHour',
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
    getEvents();
});
</script>

<template>
    <q-table
        :grid="$q.screen.xs"
        :rows="events"
        :columns="columnsEvent"
        row-key="id"
        class="col-12 my-sticky-last-column-table"
        :loading="loading"
        :no-data-label="$t('shared.noData')"
        :rows-per-page-label="$t('shared.recordsPerPage')"
    >
        <template v-slot:top v-if="!$q.screen.xs">
            <q-space />
            <q-btn
                :label="$t('event.createEvent')"
                color="primary"
                icon="mdi-plus"
                dense
                @click="
                    $router.push({
                        name: 'events-add',
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
            <event-item :key="props.row.id" :event-item="props.row">
                <template v-slot:menu>
                    <pd-menu-list :actions="actions" :row="props.row" />
                </template>
            </event-item>
        </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            v-if="$q.screen.xs"
            fab
            icon="mdi-plus"
            color="primary"
            :to="{ name: 'events-add' }"
        />
    </q-page-sticky>
</template>
