<script setup lang="ts">
import { ComputedRef, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Action } from 'src/types/UtilTypes';

import { ActivityStudentDTO } from 'src/interfaces/activity/activityStudent';

import useAuth from 'src/modules/auth/composables/useAuth';

import AbsenceList from '../absence-list/AbsenceList.vue';

const emits = defineEmits(['add-absence', 'delete-activity', 'delete-absence']);

const props = withDefaults(
    defineProps<{
        activitiesStudent?: ActivityStudentDTO[];
    }>(),
    {}
);

const { t } = useI18n();
const router = useRouter();
const { isStudent, isAdmin } = useAuth();

const actions: ComputedRef<Action<ActivityStudentDTO>[]> = computed(() => {
    return [
        {
            label: t('activity.see'),
            action: (row: ActivityStudentDTO) => {
                router.push({
                    name: 'activities-list-students',
                    params: {
                        id: row.activity.id,
                    },
                });
            },
            show: () => true,
        },
        {
            label: t('student.addAbsence'),
            action: (row: ActivityStudentDTO) =>
                emits('add-absence', row.activity),
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: ActivityStudentDTO) =>
                emits('delete-activity', row.id),
            show: () => true,
        },
    ];
});

const showAbsenceList = ref<{ [key: number]: boolean }>({});

const messageAddCourse = computed<string>(() =>
    isStudent()
        ? t('student.messageAddCourseStudent')
        : t('student.messageAddCourse')
);

const toggleAbsenceList = (activityId: number) => {
    showAbsenceList.value[activityId] = !showAbsenceList.value[activityId];
};

const handleRemoveActivityAbsence = async (absenceId: number) => {
    emits('delete-absence', absenceId);
};
</script>
<template>
    <q-list :bordered="!$q.screen.xs">
        <template v-for="item in props.activitiesStudent" :key="item.id">
            <q-item clickable v-ripple>
                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">
                            {{ $t('activity.activity') }}
                            {{ item.activity.name }}
                            {{ item.activity.level }}
                        </span>
                        <span class="text-grey-8">
                            -
                            {{ $t('shared.enum.' + item.activity.day) }}
                            {{ item.activity.startHour }}
                        </span>
                    </q-item-label>
                    <q-item-label caption lines="1">
                        {{ item.danceRole }}
                    </q-item-label>
                </q-item-section>

                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn
                            size="12px"
                            flat
                            @click="toggleAbsenceList(item.activity.id)"
                            :label="$t('student.showAbsence')"
                        >
                            <q-badge
                                v-if="item.activity.absences"
                                color="red"
                                floating
                            >
                                {{ item.activity.absences?.length }}
                            </q-badge>
                        </q-btn>
                        <pd-menu-list
                            v-if="isAdmin()"
                            :actions="actions"
                            :row="item"
                        />
                    </div>
                </q-item-section>
            </q-item>
            <q-separator />
            <absence-list
                v-if="showAbsenceList[item.activity.id]"
                :absences="item.activity.absences"
                @delete-activities-absence="handleRemoveActivityAbsence"
            />
        </template>
    </q-list>
    <q-card flat v-if="props.activitiesStudent?.length === 0">
        <q-banner class="bg-info text-white">
            {{ messageAddCourse }}
        </q-banner>
    </q-card>
</template>
