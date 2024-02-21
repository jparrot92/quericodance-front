<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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

const roles = [
    {
        label: t('user.label.admin'),
        value: 'admin',
    },
    {
        label: t('user.label.manager'),
        value: 'manager',
    },
    {
        label: t('user.label.secretary'),
        value: 'secretary',
    },
    {
        label: t('user.label.teacher'),
        value: 'teacher',
    },
    {
        label: t('user.label.student'),
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
                    :label="$t('user.label.name') + '*'"
                    v-model="user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.surnames') + '*'"
                    v-model="user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <date-selector
                    :date="user.dateOfBirth"
                    :label="$t('user.label.dateOfBirth') + '*'"
                    @update-date="(newDate: string) =>
                            (user.dateOfBirth = newDate)"
                />

                <q-input
                    :label="$t('user.label.phone') + '*'"
                    v-model="user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.phoneRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.instagram')"
                    v-model="user.instagram"
                />

                <q-input
                    :label="$t('user.label.email') + '*'"
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
                            : $t('user.label.password') + '*'
                    "
                    v-model="user.password"
                    :rules="
                        isUpdate
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('user.validations.passwordRequired'),
                              ]
                    "
                />

                <q-select
                    v-model="user.roles"
                    :options="roles"
                    :label="$t('user.label.permissions')"
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
