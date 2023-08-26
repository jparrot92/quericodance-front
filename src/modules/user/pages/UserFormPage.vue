<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';
import DateSelector from 'src/shared/components/DateSelector.vue';

import useUsers from '../composables/useUsers';

const route = useRoute();

const { id } = route.params as { id: string };

const isUpdate = computed(() => route.params.id);

const { user, loadUser, saveUser, editUser } = useUsers();

onMounted(() => {
    if (isUpdate.value) {
        loadUser(id);
    }
});

const updateUserDateOfBirth = (value: string) => {
    user.value.dateOfBirth = value;
};

const roles = ['admin', 'secretary'];

const onSubmit = async () => {
    if (isUpdate.value) {
        editUser(id);
    } else {
        saveUser();
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
                        :photo="user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.label.name')"
                    v-model="user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.surnames')"
                    v-model="user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.nif')"
                    v-model="user.nif"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nifRequired')
                    ]"
                />

                <date-selector
                    :date="user.dateOfBirth"
                    :label="$t('user.label.dateOfBirth')"
                    @update-date="updateUserDateOfBirth"
                />

                <q-input
                    :label="$t('user.label.phone')"
                    v-model="user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.streetAddress')"
                    v-model="user.address.street"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.streetAddressRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.city')"
                    v-model="user.address.city"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.cityRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.state')"
                    v-model="user.address.state"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.stateRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.zipCode')"
                    v-model="user.address.postalCode"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.zipCodeRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.country')"
                    v-model="user.address.country"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.countryRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.email')"
                    v-model="user.email"
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
                    v-model="user.password"
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

                <q-select
                    :label="$t('user.label.role')"
                    v-model="user.role"
                    :options="roles"
                    behavior="menu"
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
