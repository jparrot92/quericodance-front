<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';
import DateSelector from 'src/shared/components/DateSelector.vue';

import useTeachers from '../composables/useTeachers';

const route = useRoute();

const { id } = route.params as { id: string };

const isUpdate = computed(() => route.params.id);

const { teacher, loadTeacher, saveTeacher, editTeacher } = useTeachers();

onMounted(() => {
    if (isUpdate.value) {
        loadTeacher(id);
    }
});

const updateUserDateOfBirth = (value: string) => {
    teacher.value.user.dateOfBirth = value;
};

const onSubmit = async () => {
    if (isUpdate.value) {
        editTeacher(id);
    } else {
        saveTeacher();
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
                        :photo="teacher.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.label.name')"
                    v-model="teacher.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.surnames')"
                    v-model="teacher.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.nif')"
                    v-model="teacher.user.nif"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nifRequired')
                    ]"
                />

                <date-selector
                    :date="teacher.user.dateOfBirth"
                    :label="$t('user.label.dateOfBirth')"
                    @update-date="updateUserDateOfBirth"
                />

                <q-input
                    :label="$t('user.label.phone')"
                    v-model="teacher.user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.streetAddress')"
                    v-model="teacher.user.address.street"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.streetAddressRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.city')"
                    v-model="teacher.user.address.city"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.cityRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.state')"
                    v-model="teacher.user.address.state"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.stateRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.zipCode')"
                    v-model="teacher.user.address.postalCode"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.zipCodeRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.country')"
                    v-model="teacher.user.address.country"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.countryRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.email')"
                    v-model="teacher.user.email"
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
                            : $t('user.label.password')
                    "
                    v-model="teacher.user.password"
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
