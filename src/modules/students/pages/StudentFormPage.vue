<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

import useActivities from 'src/modules/activities/composables/useActivities';
import useStudents from '../composables/useStudents';
import { StudentDTO } from '../models/student';
import { ActivityDTO } from 'src/modules/activities/models/activity';

const { activities, loadActivities } = useActivities();
const { saveStudent, editStudent } = useStudents();

const props = withDefaults(
    defineProps<{
        student?: StudentDTO;
    }>(),
    {
        student: () => ({
            id: 0,
            user: {
                id: 0,
                name: '',
                surnames: '',
                dateOfBirth: '',
                phone: '',
                photo: '',
                instagram: '',
                email: '',
                password: '',
                roles: [],
            },
        }),
    }
);

const { t } = useI18n();

const student = ref<StudentDTO>(props.student);

const removeCoursesInterest = (idActivity: number) => {
    const index = student.value.coursesInterest?.findIndex(
        (student: ActivityDTO) => student.id === idActivity
    );
    if (index !== undefined && index !== -1) {
        student.value.coursesInterest?.splice(index, 1);
    }
};

const onSubmit = () => {
    if (props.student.id !== 0) {
        editStudent(props.student.id);
    } else {
        saveStudent(student.value);
    }
};

onMounted(() => {
    loadActivities();
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
                    <ImageUploaderPreview
                        v-if="student.user.id"
                        :id="student.user.id"
                        :photo="student.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.label.name') + '*'"
                    v-model="student.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.label.surnames') + '*'"
                    v-model="student.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <pd-date
                    :label="$t('user.label.dateOfBirth') + '*'"
                    v-model="student.user.dateOfBirth"
                />

                <pd-phone-input
                    :label="$t('user.label.phone') + '*'"
                    v-model="student.user.phone"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.phoneRequired')
                    ]"
                />

                <!-- {{ student.user.phone }} -->

                <q-input
                    :label="$t('user.label.instagram')"
                    v-model="student.user.instagram"
                />

                <q-input
                    :label="$t('user.label.email') + '*'"
                    v-model="student.user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        student.id
                            ? $t('user.label.changePassword')
                            : $t('user.label.password') + '*'
                    "
                    v-model="student.user.password"
                    :rules="
                        student.id
                            ? []
                            : [
                                  (val: string | any[]) =>
                                      (val && val.length > 0) ||
                                      $t('user.validations.passwordRequired')
                              ]
                    "
                />

                <q-select
                    v-model="student.coursesInterest"
                    multiple
                    :options="activities"
                    :label="$t('student.coursesInterest')"
                >
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                {{
                                    opt.name +
                                    ' ' +
                                    opt.level +
                                    ' - ' +
                                    t('shared.enum.' + opt.day) +
                                    ' ' +
                                    opt.startHour
                                }}
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:selected-item="{ opt }">
                        <q-chip
                            removable
                            :label="
                                opt.name +
                                ' ' +
                                opt.level +
                                ' - ' +
                                t('shared.enum.' + opt.day) +
                                ' ' +
                                opt.startHour
                            "
                            @remove="removeCoursesInterest(opt.id)"
                        />
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
