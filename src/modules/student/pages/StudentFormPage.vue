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
                    :label="$t('admin.label.name')"
                    v-model="student.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.surnames')"
                    v-model="student.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.surnamesRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.nif')"
                    v-model="student.user.nif"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.nifRequired')
                    ]"
                />

                <date-selector
                    :date="student.user.dateOfBirth"
                    :label="$t('admin.label.dateOfBirth')"
                    @update-date="updateUserDateOfBirth"
                />

                <q-input
                    :label="$t('admin.label.phone')"
                    v-model="student.user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.streetAddress')"
                    v-model="student.user.address.street"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.streetAddressRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.city')"
                    v-model="student.user.address.city"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.cityRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.state')"
                    v-model="student.user.address.state"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.stateRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.zipCode')"
                    v-model="student.user.address.postalCode"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.zipCodeRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.country')"
                    v-model="student.user.address.country"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.countryRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.email')"
                    v-model="student.user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        isUpdate
                            ? $t('admin.label.changePassword')
                            : $t('admin.label.password')
                    "
                    v-model="student.user.password"
                    :rules="
                        isUpdate
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('admin.validations.passwordRequired')
                              ]
                    "
                />

                <q-btn
                    :label="$t('admin.label.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
