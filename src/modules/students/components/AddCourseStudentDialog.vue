<script setup lang="ts">
import { onMounted, defineProps, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { DanceRole } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useCourses from 'src/modules/activities/composables/useCourses';
import { CourseListViewDTO } from 'src/model/activity.model';

const props = withDefaults(
    defineProps<{
        idStudent: number;
    }>(),
    {}
);

const emits = defineEmits(['close', 'addCourseStudent']);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();
const { courses, courseStudent, loadCourses, saveCourseStudent } = useCourses();
const danceRoles = generateEnumOptions(DanceRole);

const courseId = ref<number>(0);
const danceRole = ref<string>('');
const isDialogVisible: Ref<boolean> = ref<boolean>(true);
const coursesFiltered = ref<CourseListViewDTO[]>([]);

const addCourseStudent = async () => {
    courseId.value = courseStudent.value.course.id;
    danceRole.value = courseStudent.value.danceRole;

    const newActivityStudent = await saveCourseStudent(
        props.idStudent,
        courseId.value,
        danceRole.value
    );
    if (newActivityStudent) {
        emits('addCourseStudent', newActivityStudent);
    }
};

const filterFn = (val: string, update: (fn: () => void) => void) => {
    setTimeout(() => {
        update(() => {
            if (val === '') {
                coursesFiltered.value = courses.value;
            } else {
                const needle = val
                    .toLowerCase()
                    .replace(/\s/g, '')
                    .toLowerCase();
                coursesFiltered.value = courses.value.filter(
                    (activity: CourseListViewDTO) => {
                        const activityFullName =
                            activity.name.toLowerCase() +
                            activity.level +
                            t('shared.enum.' + activity.day).toLowerCase() +
                            activity.startHour;

                        return activityFullName.includes(needle);
                    }
                );
            }
        });
    }, 500);
};

onMounted(() => {
    loadCourses();
    coursesFiltered.value = courses.value;
});
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">{{ $t('student.addCourse') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <q-select
                    v-model="courseStudent.course"
                    :label="$t('student.course')"
                    :options="coursesFiltered"
                    :option-value="'id'"
                    use-input
                    @filter="filterFn"
                >
                    <template v-slot:selected-item="{ opt }">
                        {{
                            courseStudent.course.id !== 0
                                ? opt.name +
                                  ' ' +
                                  opt.level +
                                  ' - ' +
                                  t('shared.enum.' + opt.day) +
                                  ' ' +
                                  opt.startHour
                                : ''
                        }}
                    </template>
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                {{
                                    opt.name +
                                    ' ' +
                                    opt.level +
                                    ' - ' +
                                    t('shared.enum.' + opt.day) +
                                    ' ' +
                                    opt.startHour
                                }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-select
                    v-model="courseStudent.danceRole"
                    :options="danceRoles"
                    :label="$t('student.role')"
                    emit-value
                />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('shared.add')"
                    color="primary"
                    @click="addCourseStudent()"
                />
                <q-btn
                    flat
                    :label="$t('shared.cancel')"
                    color="primary"
                    @click="emits('close')"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
