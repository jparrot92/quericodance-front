<script setup lang="ts">
import { Ref, ref } from 'vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useStudents from '../composables/useStudents';

import StudentFormPage from './StudentFormPage.vue';
import MembershipStudentFormPage from './MembershipStudentFormPage.vue';
import ActivitiesStudentFormPage from './ActivitiesStudentFormPage.vue';
import ObservationsStudentFormPage from './ObservationsStudentFormPage.vue';
import { MembershipViewDTO } from '../models/membership';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';

const route = useRoute();

const idStudent = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { student, loadStudent } = useStudents();
const tab = ref('student-data');

const isModalVisible: Ref<boolean> = ref(false);

const updateMembership = async (membershipView: MembershipViewDTO) =>
    (student.value.membership = membershipView);

const updateActivitiesStudent = async (activitiesStudent: ActivityStudent[]) =>
    (student.value.activitiesStudent = activitiesStudent);

const deleteMembership = async (activitiesStudent: ActivityStudent[]) => {
    student.value.membership = undefined;
    student.value.activitiesStudent = [];
};

onMounted(async () => {
    if (idStudent.value) {
        await loadStudent(idStudent.value);
    }
    isModalVisible.value = true;
});
</script>

<template>
    <q-card v-if="isModalVisible">
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
                    @update-membership="updateMembership"
                    @delete-membership="deleteMembership"
                />
            </q-tab-panel>

            <q-tab-panel name="courses">
                <activities-student-form-page
                    :id-student="student.id"
                    :has-membership="!!student.membership"
                    :activitiesStudent="student.activitiesStudent"
                    @update-activities-student="updateActivitiesStudent"
                />
            </q-tab-panel>

            <q-tab-panel name="observations">
                <observations-student-form-page :student="student" />
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>
