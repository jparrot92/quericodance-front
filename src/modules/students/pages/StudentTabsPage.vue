<script setup lang="ts">
import { ref } from 'vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useStudents from '../composables/useStudents';

import StudentFormPage from './StudentFormPage.vue';
import MembershipStudentFormPage from './MembershipStudentFormPage.vue';
import ActivitiesStudentFormPage from './ActivitiesStudentFormPage.vue';
import ObservationsStudentFormPage from './ObservationsStudentFormPage.vue';

const route = useRoute();

const idStudent = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { student, loadStudent } = useStudents();
const tab = ref('student-data');

onMounted(() => {
    if (idStudent.value) {
        loadStudent(idStudent.value);
    }
});
</script>

<template>
    <q-card>
        <q-tabs
            v-model="tab"
            narrow-indicator
            indicator-color="primary"
            class="bg-secondary text-white shadow-2"
            align="justify"
        >
            <q-tab
                name="student-data"
                :label="$t('student.label.studentData')"
            />
            <q-tab name="membership" :label="$t('student.membership')" />
            <q-tab name="courses" :label="$t('student.label.courses')" />
            <q-tab
                name="observations"
                :label="$t('student.label.observations')"
            />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="student-data">
                <student-form-page :student="student" />
            </q-tab-panel>

            <q-tab-panel name="membership">
                <membership-student-form-page
                    :id-student="student.id"
                    :membership="student.membership"
                />
            </q-tab-panel>

            <q-tab-panel name="courses">
                <activities-student-form-page
                    :activitiesStudent="student.activitiesStudent"
                    :id-student="student.id"
                />
            </q-tab-panel>

            <q-tab-panel name="observations">
                <observations-student-form-page :student="student" />
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>
