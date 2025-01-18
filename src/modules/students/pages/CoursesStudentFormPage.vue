<script setup lang="ts">
import { onMounted, defineProps, ref, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

import { CourseDTO } from 'src/model/activity.model';
import { AbsenceDTO } from 'src/model/activity.model';
import { CourseStudentDTO } from 'src/model/activity.model';

import { useAuthStore } from '../../auth/store/auth-store';
import useAuth from '../../auth/composables/useAuth';

import useCourses from 'src/modules/activities/composables/useCourses';

import AddCourseStudentDialog from '../components/AddCourseStudentDialog.vue';
import AddCourseAbsenceDialog from '../components/AddCourseAbsenceDialog.vue';

import CoursesStudentList from '../components/courses-student-list/CoursesStudentList.vue';

const emits = defineEmits(['update-courses-student']);

const props = withDefaults(
    defineProps<{
        idStudent: number;
        hasMembership: boolean;
        coursesStudent?: CourseStudentDTO[];
    }>(),
    {}
);

const { t } = useI18n();

const { isStudent, isAdmin, refreshInfoStudent } = useAuth();
const authStore = useAuthStore();
const { removeCourseStudent, removeCourseAbsence } = useCourses();

const hasMembership = ref<boolean>(props.hasMembership);
const studentActivitiesList = ref<CourseStudentDTO[]>(
    props.coursesStudent || []
);

const showModalAddCourse = ref(false);
const showModalAddCourseAbsence = ref(false);
const courseAbsence = ref<CourseDTO>();

const messageNotMembership = computed<string>(() =>
    isStudent()
        ? t('student.messageNotMembershipStudent')
        : t('student.messageNotMembership')
);

const addCourseStudent = (newCourseStudent: CourseStudentDTO) => {
    studentActivitiesList.value = [
        ...studentActivitiesList.value,
        newCourseStudent,
    ];

    emits('update-courses-student', studentActivitiesList.value);
};

const deleteCourseStudent = async (id: number) => {
    try {
        await removeCourseStudent(id);

        const updatedActivities = studentActivitiesList.value.filter(
            (courseStudent) => courseStudent.id !== id
        );

        studentActivitiesList.value = updatedActivities;

        emits('update-courses-student', updatedActivities);
    } catch (error) {
        console.error(error);
    }
};

const showCourseAbsence = async (course: CourseDTO) => {
    courseAbsence.value = course;
    showModalAddCourseAbsence.value = true;
};

const addCourseAbsence = (absence: AbsenceDTO) => {
    if (!courseAbsence.value) {
        return;
    }

    // Actualizar la lista de actividades del estudiante
    const updatedActivities = studentActivitiesList.value.map(
        (courseStudent) => {
            if (courseStudent.course.id === courseAbsence.value?.id) {
                // Solo agregar la ausencia si no está en la lista ya
                const updatedAbsences = courseStudent.course.absences
                    ? [...courseStudent.course.absences, absence]
                    : [absence];

                return {
                    ...courseStudent,
                    course: {
                        ...courseStudent.course,
                        absences: updatedAbsences,
                    },
                };
            }
            return courseStudent;
        }
    );

    studentActivitiesList.value = updatedActivities;

    emits('update-courses-student', studentActivitiesList.value);

    showModalAddCourseAbsence.value = false;
};

const handleRemoveCourseAbsence = async (absenceId: number) => {
    try {
        await removeCourseAbsence(absenceId);

        const updatedActivities = studentActivitiesList.value.map(
            (courseStudent) => {
                const updatedAbsences = courseStudent.course.absences?.filter(
                    (absence) => absence.id !== absenceId
                );

                return {
                    ...courseStudent,
                    course: {
                        ...courseStudent.course,
                        absences: updatedAbsences,
                    },
                };
            }
        );

        studentActivitiesList.value = updatedActivities;

        emits('update-courses-student', studentActivitiesList.value);
    } catch (error) {
        console.error(error);
    }
};

const preventNav = async (event: BeforeUnloadEvent) => {
    await refreshInfoStudent();
    event.preventDefault();
    event.returnValue = '';
};

onMounted(() => {
    studentActivitiesList.value = props.coursesStudent || [];
    if (isStudent()) {
        window.addEventListener('beforeunload', preventNav);
        hasMembership.value = authStore.user?.student?.membership
            ? true
            : false;
        studentActivitiesList.value =
            authStore.user?.student?.coursesStudent || [];
    }
});

onBeforeUnmount(() => {
    if (isStudent()) {
        window.removeEventListener('beforeunload', preventNav);
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <template v-if="hasMembership">
                    <courses-student-list
                        :courses-student="studentActivitiesList"
                        @add-absence="showCourseAbsence"
                        @delete-course="deleteCourseStudent"
                        @delete-absence="handleRemoveCourseAbsence"
                    />
                    <q-btn
                        v-if="!$q.screen.xs && isAdmin()"
                        :label="$t('student.addCourse')"
                        color="primary"
                        class="full-width"
                        rounded
                        @click="showModalAddCourse = true"
                    />
                    <q-page-sticky position="bottom-right" :offset="[18, 18]">
                        <q-btn
                            v-if="$q.screen.xs && isAdmin()"
                            fab
                            icon="mdi-plus"
                            color="primary"
                            @click="showModalAddCourse = true"
                        />
                    </q-page-sticky>
                </template>
                <template v-else>
                    <q-card flat>
                        <q-banner class="bg-info text-white">
                            {{ messageNotMembership }}
                        </q-banner>
                    </q-card>
                </template>
            </div>
        </div>
    </q-page>

    <AddCourseStudentDialog
        v-if="isAdmin() && showModalAddCourse"
        :id-student="props.idStudent"
        @close="showModalAddCourse = false"
        @add-course-student="addCourseStudent"
    />
    <AddCourseAbsenceDialog
        v-if="isAdmin() && courseAbsence && showModalAddCourseAbsence"
        :id-student="props.idStudent"
        :course-absence="courseAbsence"
        @close="showModalAddCourseAbsence = false"
        @add-course-absence="addCourseAbsence"
    />
</template>
