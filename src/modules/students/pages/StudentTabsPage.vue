<script setup lang="ts">
import { Ref, ref } from 'vue';
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { MembershipViewDTO } from 'src/interfaces/student/membership';
import { ActivityStudentDTO } from 'src/interfaces/activity/activityStudent';
import { BonusStudentDTO } from 'src/interfaces/student/bonusStudent';

import useStudents from '../composables/useStudents';

import StudentFormPage from './StudentFormPage.vue';
import MembershipStudentFormPage from './MembershipStudentFormPage.vue';
import BonusesStudentFormPage from './BonusesStudentFormPage.vue';
import ActivitiesStudentFormPage from './ActivitiesStudentFormPage.vue';
import ObservationsStudentFormPage from './ObservationsStudentFormPage.vue';

const route = useRoute();

const idStudent = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { student, loadStudent } = useStudents();
const tab = ref('student-data');

const isModalVisible: Ref<boolean> = ref(false);

const updateMembership = async (membershipView: MembershipViewDTO) =>
    (student.value.membership = membershipView);

const updateActivitiesStudent = async (
    activitiesStudent: ActivityStudentDTO[]
) => (student.value.activitiesStudent = activitiesStudent);

const updateBonusesStudent = async (bonuses: BonusStudentDTO[]) =>
    (student.value.bonusesStudent = bonuses);

const deleteMembership = async () => {
    student.value.membership = undefined;
    student.value.activitiesStudent = [];
};

onMounted(async () => {
    if (idStudent.value) {
        await loadStudent(Number(idStudent.value));
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
            <q-tab name="student-data" :label="$t('student.studentData')" />
            <q-tab name="courses" :label="$t('student.courses')" />
            <q-tab name="observations" :label="$t('student.observations')" />
            <q-tab name="membership" :label="$t('student.membership')" />
            <q-tab name="bonuses" :label="$t('student.bonuses')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="student-data">
                <student-form-page :student="student" />
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

            <q-tab-panel name="membership">
                <membership-student-form-page
                    :id-student="student.id"
                    :membership="student.membership || null"
                    @update-membership="updateMembership"
                    @delete-membership="deleteMembership"
                />
            </q-tab-panel>

            <q-tab-panel name="bonuses">
                <bonuses-student-form-page
                    :id-student="student.id"
                    :bonuses-student="student.bonusesStudent"
                    @update-bonuses-student="updateBonusesStudent"
                />
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>
<style scoped>
.q-tab-panel {
    padding: 0px;
}
</style>
