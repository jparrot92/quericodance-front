<script setup lang="ts">
import { onMounted } from 'vue';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

import useProfile from '../composables/useProfile';

const { user, loadProfile, editProfile } = useProfile();

onMounted(() => {
    loadProfile();
});

const updateUserDateOfBirth = (value: string) => {
    user.value.dateOfBirth = value;
};

const roles = ['user', 'secretary'];

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

                <pd-date
                    :label="$t('user.label.dateOfBirth')"
                    v-model="user.dateOfBirth"
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
                        true
                            ? $t('user.label.changePassword')
                            : $t('user.label.password')
                    "
                    v-model="user.password"
                    :rules="
                        true
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('user.validations.passwordRequired'),
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
