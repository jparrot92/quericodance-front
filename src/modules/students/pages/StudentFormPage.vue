<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

import useActivities from 'src/modules/activities/composables/useActivities';
import useStudents from '../composables/useStudents';
import { StudentDTO } from '../models/student';
import { ActivityDTO } from 'src/modules/activities/models/activity';

const { activities, loadActivities } = useActivities();
const { student: studentForm, saveStudent, editStudent } = useStudents();

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

studentForm.value = props.student;

const removeCoursesInterest = (idActivity: number) => {
    const index = studentForm.value.interestedActivities?.findIndex(
        (student: ActivityDTO) => student.id === idActivity
    );
    if (index !== undefined && index !== -1) {
        studentForm.value.interestedActivities?.splice(index, 1);
    }
};

const onSubmit = () => {
    if (props.student.id !== 0) {
        editStudent(props.student.id);
    } else {
        saveStudent(studentForm.value);
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
                        v-if="studentForm.user.id"
                        :id="studentForm.user.id"
                        :photo="studentForm.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('user.name') + '*'"
                    v-model="studentForm.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.nameRequired')
                    ]"
                />

                <q-input
                    :label="$t('user.surnames') + '*'"
                    v-model="studentForm.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.surnamesRequired')
                    ]"
                />

                <pd-date
                    :label="$t('user.dateOfBirth') + '*'"
                    v-model="studentForm.user.dateOfBirth"
                />

                <pd-phone-input
                    :label="$t('user.phone') + '*'"
                    v-model="studentForm.user.phone"
                    :required="true"
                />

                <q-input
                    :label="$t('user.instagram')"
                    v-model="studentForm.user.instagram"
                />

                <q-input
                    :label="$t('user.email') + '*'"
                    v-model="studentForm.user.email"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('user.validations.emailRequired')
                    ]"
                />

                <q-input
                    :label="
                        student.id
                            ? $t('user.changePassword')
                            : $t('user.password') + '*'
                    "
                    v-model="studentForm.user.password"
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
                    v-model="studentForm.interestedActivities"
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
