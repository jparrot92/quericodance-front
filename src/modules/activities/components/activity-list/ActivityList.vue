<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useActivities from '../../composables/useActivities';

const { loading, activities, loadActivities, removeActivity } = useActivities();

const $q = useQuasar();

const { t } = useI18n();

onMounted(() => {
    loadActivities();
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string;
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
}

const columnsUser: ColumnTable[] = [
    {
        name: 'name',
        align: 'left',
        label: t('activity.label.name'),
        field: 'name',
        sortable: true
    },
    {
        name: 'day',
        align: 'left',
        label: t('activity.label.day'),
        field: 'day',
        sortable: true
    },
    {
        name: 'hour',
        align: 'left',
        label: t('activity.label.hour'),
        field: 'hour',
        sortable: true
    },
    {
        name: 'hour',
        align: 'left',
        label: t('activity.label.hour'),
        field: 'hour',
        sortable: true
    },
    {
        name: 'hour',
        align: 'left',
        label: t('activity.label.hour'),
        field: 'hour',
        sortable: true
    },
    {
        name: 'actions',
        align: 'right',
        label: t('activity.label.actions'),
        field: 'actions',
        sortable: false
    }
];
</script>

<template>
    <div class="row">
        <q-table
            :rows="activities"
            :columns="columnsUser"
            row-key="id"
            class="col-12"
            :loading="loading"
        >
            <template v-slot:top>
                <span class="text-h6">
                    {{ $t('activity.label.activities') }}
                </span>
                <q-space />
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('activity.label.createActivity')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'activities-add'
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
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-sm">
                    <q-btn
                        icon="mdi-pencil-outline"
                        color="info"
                        dense
                        size="sm"
                        @click="
                            $router.push({
                                name: 'activities-edit',
                                params: { id: props.row.id }
                            })
                        "
                    >
                        <q-tooltip> {{ $t('activity.label.edit') }} </q-tooltip>
                    </q-btn>
                    <q-btn
                        icon="mdi-delete-outline"
                        color="negative"
                        dense
                        size="sm"
                        @click="removeActivity(props.row.id)"
                    >
                        <q-tooltip>
                            {{ $t('activity.label.delete') }}
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
    </div>
</template>
