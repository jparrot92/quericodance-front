<script setup lang="ts">
import { ref } from 'vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useStudents from '../composables/useStudents';

import StudentFormPage from './StudentFormPage.vue';
import ActivitiesStudentFormPage from './ActivitiesStudentFormPage.vue';

const route = useRoute();

const idStudent = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { student, loadStudent } = useStudents();

onMounted(() => {
    if (idStudent.value) {
        loadStudent(idStudent.value);
    }
});

const tab = ref('student-data');
</script>

<template>
    <q-card>
        <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
        >
            <q-tab
                name="student-data"
                :label="$t('student.label.studentData')"
            />
            <q-tab name="courses" :label="$t('student.label.courses')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="student-data">
                <student-form-page :student="student" />
            </q-tab-panel>

            <q-tab-panel name="courses">
                <activities-student-form-page
                    :activitiesStudent="student.activitiesStudent"
                    :id-student="student.id"
                />
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>
