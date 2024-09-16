<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

import useTeachers from '../composables/useTeachers';

const route = useRoute();

const idTeacher = computed<string | undefined>(() =>
    route.params.id?.toString()
);

const { teacher, loadTeacher, saveTeacher, editTeacher } = useTeachers();

onMounted(() => {
    if (idTeacher.value) {
        loadTeacher(idTeacher.value);
    }
});

const onSubmit = async () => {
    if (idTeacher.value) {
        editTeacher(idTeacher.value);
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
                        v-if="idTeacher"
                        :id="+teacher.user.id"
                        :photo="teacher.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.name') + '*'"
                    v-model="teacher.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.surnames') + '*'"
                    v-model="teacher.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <pd-date
                    :label="$t('user.dateOfBirth') + '*'"
                    v-model="teacher.user.dateOfBirth"
                />

                <pd-phone-input
                    :label="$t('user.phone') + '*'"
                    v-model="teacher.user.phone"
                    :required="true"
                />

                <q-input
                    :label="$t('user.instagram')"
                    v-model="teacher.user.instagram"
                />

                <q-input
                    :label="$t('user.email') + '*'"
                    v-model="teacher.user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        idTeacher
                            ? $t('user.changePassword')
                            : $t('user.password') + '*'
                    "
                    v-model="teacher.user.password"
                    :rules="
                        idTeacher
                            ? []
                            : [
                                  (val) =>
                                      (val && val.length > 0) ||
                                      $t('user.validations.passwordRequired'),
                              ]
                    "
                />

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
