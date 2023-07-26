<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';
import DateSelector from 'src/shared/components/DateSelector.vue';

import useProfile from '../composables/useProfile';

const route = useRoute();

const { id } = route.params as { id: string };

const { user, loadProfile, editProfile } = useProfile();

onMounted(() => {
    loadProfile();
});

const updateUserDateOfBirth = (value: string) => {
    user.value.dateOfBirth = value;
};

const roles = ['admin', 'secretary'];

const onSubmit = async () => {
    editProfile();
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
                    <ImageUploaderPreview :id="user.id" :photo="user.photo" />
                </div>

                <q-input
                    :label="$t('admin.label.name')"
                    v-model="user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.surnames')"
                    v-model="user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.surnamesRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.nif')"
                    v-model="user.nif"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.nifRequired')
                    ]"
                />

                <date-selector
                    :date="user.dateOfBirth"
                    :label="$t('admin.label.dateOfBirth')"
                    @update-date="updateUserDateOfBirth"
                />

                <q-input
                    :label="$t('admin.label.phone')"
                    v-model="user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.streetAddress')"
                    v-model="user.address.street"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.streetAddressRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.city')"
                    v-model="user.address.city"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.cityRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.state')"
                    v-model="user.address.state"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.stateRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.zipCode')"
                    v-model="user.address.postalCode"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.zipCodeRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.country')"
                    v-model="user.address.country"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.countryRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.email')"
                    v-model="user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        true
                            ? $t('admin.label.changePassword')
                            : $t('admin.label.password')
                    "
                    v-model="user.password"
                    :rules="
                        true
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('admin.validations.passwordRequired')
                              ]
                    "
                />

                <q-select
                    :label="$t('admin.label.role')"
                    v-model="user.role"
                    :options="roles"
                    behavior="menu"
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
