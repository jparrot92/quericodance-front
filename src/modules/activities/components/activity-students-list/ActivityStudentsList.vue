<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useActivities from '../../composables/useActivities';
import { ActivityStudent } from '../../models/activityStudent';

import MenuList from 'src/shared/components/MenuList.vue';

const { t } = useI18n();
const route = useRoute();

const { loading, activity, loadStudentsActivity, removeActivityStudent } =
    useActivities();
const { id } = route.params as { id: string };

onMounted(() => {
    loadStudentsActivity(+id);
});

export interface ColumnTable {
    name: string;
    label: string;
    field: string | ((row: ActivityStudent) => string | undefined);
    align?: 'left' | 'right' | 'center';
    sortable?: boolean;
}

const columnTable: ColumnTable[] = [
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

const deleteActivityStudent = async (idActivityStudent: number) => {
    try {
        await removeActivityStudent(idActivityStudent);
        loadStudentsActivity(+id);
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <div class="row">
        <q-table
            :rows="activity.activitiesStudent"
            :columns="columnTable"
            row-key="id"
            class="col-12 my-sticky-last-column-table"
            :loading="loading"
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

                <!-- Disponible mas adelante
                <q-btn
                    v-if="$q.platform.is.desktop"
                    :label="$t('student.label.addStudent')"
                    color="primary"
                    icon="mdi-plus"
                    dense
                    @click="
                        $router.push({
                            name: 'activities-add'
                        })
                    "
                />
                -->
                <div style="width: 100%" class="q-pa-md q-gutter-md">
                    <q-chip color="blue" text-color="white">
                        {{ $t('activity.label.numberLeaders') }} :
                        {{ activity.numberLeaders }}
                    </q-chip>
                    <q-chip color="pink" text-color="white">
                        {{ $t('activity.label.numberFollowers') }} :
                        {{ activity.numberFollowers }}
                    </q-chip>
                    <q-chip color="green" text-color="white">
                        {{ $t('activity.label.costEffectiveness') }} :
                        {{ activity.costEffectiveness + ' €' }}
                    </q-chip>
                </div>
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
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <menu-list>
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
