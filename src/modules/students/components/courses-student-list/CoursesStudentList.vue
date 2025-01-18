<script setup lang="ts">
import { ComputedRef, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Action } from 'src/types/UtilTypes';
import { CourseStudentDTO } from 'src/model/activity.model';
import useAuth from 'src/modules/auth/composables/useAuth';
import AbsenceList from '../absence-list/AbsenceList.vue';

const emits = defineEmits(['add-absence', 'delete-course', 'delete-absence']);

const props = withDefaults(
    defineProps<{
        coursesStudent?: CourseStudentDTO[];
    }>(),
    {}
);

const { t } = useI18n();
const router = useRouter();
const { isStudent, isAdmin } = useAuth();

const showAbsenceList = ref<{ [key: number]: boolean }>({});

const actions: ComputedRef<Action<CourseStudentDTO>[]> = computed(() => {
    return [
        {
            label: t('course.see'),
            action: (row: CourseStudentDTO) => {
                router.push({
                    name: 'courses-list-students',
                    params: {
                        id: row.course.id,
                    },
                });
            },
            show: () => true,
        },
        {
            label: t('student.addAbsence'),
            action: (row: CourseStudentDTO) => emits('add-absence', row.course),
            show: () => true,
        },
        {
            label: t('shared.delete'),
            action: (row: CourseStudentDTO) => emits('delete-course', row.id),
            show: () => true,
        },
    ];
});

const messageAddCourse = computed<string>(() =>
    isStudent()
        ? t('student.messageAddCourseStudent')
        : t('student.messageAddCourse')
);

const toggleAbsenceList = (courseId: number) => {
    showAbsenceList.value[courseId] = !showAbsenceList.value[courseId];
};

const handleRemoveActivityAbsence = async (absenceId: number) => {
    emits('delete-absence', absenceId);
};
</script>
<template>
    <q-list :bordered="!$q.screen.xs">
        <template v-for="item in props.coursesStudent" :key="item.id">
            <q-item clickable v-ripple>
                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">
                            {{ $t('course.course') }}
                            {{ item.course.name }}
                            {{ item.course.level }}
                        </span>
                        <span class="text-grey-8">
                            -
                            {{ $t('shared.enum.' + item.course.day) }}
                            {{ item.course.startHour }}
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
                            @click="toggleAbsenceList(item.course.id)"
                            :label="$t('student.showAbsence')"
                        >
                            <q-badge
                                v-if="item.course.absences"
                                color="red"
                                floating
                            >
                                {{ item.course.absences?.length }}
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
                v-if="showAbsenceList[item.course.id]"
                :absences="item.course.absences"
                @delete-activities-absence="handleRemoveActivityAbsence"
            />
        </template>
    </q-list>
    <q-card flat v-if="props.coursesStudent?.length === 0">
        <q-banner class="bg-info text-white">
            {{ messageAddCourse }}
        </q-banner>
    </q-card>
</template>
