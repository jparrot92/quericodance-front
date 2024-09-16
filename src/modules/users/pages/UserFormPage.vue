<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

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

const roles = [
    {
        label: t('user.admin'),
        value: 'admin',
    },
    {
        label: t('user.manager'),
        value: 'manager',
    },
    {
        label: t('user.secretary'),
        value: 'secretary',
    },
    {
        label: t('user.teacher'),
        value: 'teacher',
    },
    {
        label: t('user.student'),
        value: 'student',
    },
];

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
                    :label="$t('user.name') + '*'"
                    v-model="user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    :label="$t('user.surnames') + '*'"
                    v-model="user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <pd-date
                    :label="$t('user.dateOfBirth') + '*'"
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
                    :label="$t('user.email') + '*'"
                    v-model="user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    :label="
                        isUpdate
                            ? $t('user.changePassword')
                            : $t('user.password') + '*'
                    "
                    v-model="user.password"
                    :rules="
                        isUpdate
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('shared.validations.required'),
                              ]
                    "
                />

                <q-select
                    v-model="user.roles"
                    :options="roles"
                    :label="$t('user.permissions')"
                    multiple
                    emit-value
                    map-options
                >
                    <template
                        v-slot:option="{
                            itemProps,
                            opt,
                            selected,
                            toggleOption,
                        }"
                    >
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                <q-item-label>
                                    {{ opt.label }}
                                </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-toggle
                                    :model-value="selected"
                                    @update:model-value="toggleOption(opt)"
                                />
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-btn
                    :label="$t('user.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
