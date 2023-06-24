<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineAsyncComponent } from 'vue';

import useUser from '../composables/useUser';

const route = useRoute();

const { id } = route.params as { id: string };

const ImageUploaderPreview = defineAsyncComponent(
    () => import('src/shared/components/ImageUploaderPreview.vue')
);

const { isUpdate, user, onSubmit } = useUser(id);
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-12 text-center">
                <p class="text-h6">Form User</p>
            </div>
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <q-input
                    :label="$t('admin.label.photo')"
                    stack-label
                    v-model="user.photo"
                    type="file"
                    accept="image/*"
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
                    :label="$t('admin.label.surname')"
                    v-model="user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.surnameRequired')
                    ]"
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
                    v-model="user.streetAddress"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.streetAddressRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.num')"
                    v-model="user.num"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.numRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.state')"
                    v-model="user.state"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.stateRequired')
                    ]"
                />

                <q-input
                    :label="$t('admin.label.zipCode')"
                    v-model="user.zipCode"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.zipCodeRequired')
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
                    :label="$t('admin.label.password')"
                    v-model="user.password"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('admin.validations.passwordRequired')
                    ]"
                />

                <q-btn
                    :label="isUpdate ? 'Update' : 'Save'"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />

                <q-btn
                    label="Cancel"
                    color="primary"
                    class="full-width"
                    rounded
                    flat
                    :to="{ name: 'admin-page' }"
                />
            </q-form>
        </div>
    </q-page>
</template>
