<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';
import DateSelector from 'src/shared/components/DateSelector.vue';

import useStudents from '../composables/useStudents';

const route = useRoute();

const { id } = route.params as { id: string };

const isUpdate = computed(() => route.params.id);

const { student, loadStudent, saveStudent, editStudent } = useStudents();

onMounted(() => {
    if (isUpdate.value) {
        loadStudent(id);
    }
});

const updateUserDateOfBirth = (value: string) => {
    student.value.user.dateOfBirth = value;
};

const onSubmit = async () => {
    if (isUpdate.value) {
        editStudent(id);
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
                        v-if="isUpdate"
                        :id="+id"
                        :photo="student.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.label.name') + '*'"
                    v-model="student.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.surnames') + '*'"
                    v-model="student.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <date-selector
                    :date="student.user.dateOfBirth"
                    :label="$t('user.label.dateOfBirth') + '*'"
                    @update-date="updateUserDateOfBirth"
                />

                <q-input
                    :label="$t('user.label.phone') + '*'"
                    v-model="student.user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.instagram')"
                    v-model="student.user.instagram"
                />

                <q-input
                    :label="$t('user.label.email') + '*'"
                    v-model="student.user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        isUpdate
                            ? $t('user.label.changePassword')
                            : $t('user.label.password') + '*'
                    "
                    v-model="student.user.password"
                    :rules="
                        isUpdate
                            ? []
                            : [
                                  (val) =>
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
