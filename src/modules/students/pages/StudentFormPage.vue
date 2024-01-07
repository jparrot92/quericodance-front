<script setup lang="ts">
import { watch, defineProps } from 'vue';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';
import DateSelector from 'src/shared/components/DateSelector.vue';

import useStudents from '../composables/useStudents';
import { Student } from '../models/student';

const { student: newStudent, saveStudent, editStudent } = useStudents();

interface Props {
    student?: Student;
}

const props = defineProps<Props>();

const selectedStudent = newStudent;

watch(props, () => {
    if (props.student !== undefined) {
        selectedStudent.value = props.student;
    }
});

const onSubmit = async () => {
    if (selectedStudent.value.id) {
        editStudent(selectedStudent.value.id);
    } else {
        saveStudent();
    }
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <div style="text-align: center">
                    <ImageUploaderPreview
                        v-if="selectedStudent.user.id"
                        :id="selectedStudent.user.id"
                        :photo="selectedStudent.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.label.name') + '*'"
                    v-model="selectedStudent.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.surnames') + '*'"
                    v-model="selectedStudent.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <date-selector
                    :date="selectedStudent.user.dateOfBirth"
                    :label="$t('user.label.dateOfBirth') + '*'"
                    @update-date="
                        (newValue: string) =>
                            (selectedStudent.user.dateOfBirth = newValue)
                    "
                />

                <q-input
                    :label="$t('user.label.phone') + '*'"
                    v-model="selectedStudent.user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.instagram')"
                    v-model="selectedStudent.user.instagram"
                />

                <q-input
                    :label="$t('user.label.email') + '*'"
                    v-model="selectedStudent.user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        selectedStudent.id
                            ? $t('user.label.changePassword')
                            : $t('user.label.password') + '*'
                    "
                    v-model="selectedStudent.user.password"
                    :rules="
                        selectedStudent.id
                            ? []
                            : [
                                  (val: string | any[]) =>
                                      (val && val.length > 0) ||
                                      $t('user.validations.passwordRequired')
                              ]
                    "
                />

                <q-btn
                    :label="$t('user.label.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
