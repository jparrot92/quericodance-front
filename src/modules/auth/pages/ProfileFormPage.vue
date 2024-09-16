<script setup lang="ts">
import { onMounted } from 'vue';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

import useProfile from '../composables/useProfile';

const { user, loadProfile, editProfile } = useProfile();

const onSubmit = async () => {
    editProfile();
};

onMounted(() => {
    loadProfile();
});
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
                    :label="$t('shared.name')"
                    v-model="user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    :label="$t('user.surnames')"
                    v-model="user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <pd-date
                    :label="$t('user.dateOfBirth')"
                    v-model="user.dateOfBirth"
                />

                <pd-phone-input
                    :label="$t('user.phone') + '*'"
                    v-model="user.phone"
                    :required="true"
                />

                <q-input
                    :label="$t('user.instagram')"
                    v-model="user.instagram"
                />

                <q-input
                    :label="$t('user.email')"
                    v-model="user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    :label="
                        true ? $t('user.changePassword') : $t('user.password')
                    "
                    v-model="user.password"
                    :rules="
                        true
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('shared.validations.required'),
                              ]
                    "
                />

                <q-btn
                    :label="$t('shared.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
