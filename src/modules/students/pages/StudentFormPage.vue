<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Status } from 'src/types/UtilTypes';

import { StudentDTO } from 'src/interfaces/student/student';
import {
    ActivityDTO,
    ActivityListViewDTO,
} from 'src/interfaces/activity/activity';

import ImageUploaderPreview from 'src/shared/components/ImageUploaderPreview.vue';

import useActivities from 'src/modules/activities/composables/useActivities';
import useStudents from '../composables/useStudents';

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
            status: Status.NEW,
        }),
    }
);

const { t } = useI18n();

studentForm.value = props.student;

const activitiesFiltered = ref<ActivityListViewDTO[]>([]);

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

const filterFn = (val: string, update: (fn: () => void) => void) => {
    setTimeout(() => {
        update(() => {
            if (val === '') {
                activitiesFiltered.value = activities.value;
            } else {
                const needle = val
                    .toLowerCase()
                    .replace(/\s/g, '')
                    .toLowerCase();
                activitiesFiltered.value = activities.value.filter(
                    (activity: ActivityListViewDTO) => {
                        const activityFullName =
                            activity.name.toLowerCase() +
                            activity.level +
                            t('shared.enum.' + activity.day).toLowerCase() +
                            activity.startHour;

                        return activityFullName.includes(needle);
                    }
                );
            }
        });
    }, 500);
};

onMounted(async () => {
    await loadActivities();
    activitiesFiltered.value = activities.value;
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
                    :label="$t('shared.name') + '*'"
                    v-model="studentForm.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    :label="$t('user.surnames') + '*'"
                    v-model="studentForm.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
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
                            $t('shared.validations.required')
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
                                      $t('shared.validations.required')
                              ]
                    "
                />

                <q-select
                    v-model="studentForm.interestedActivities"
                    multiple
                    :options="activitiesFiltered"
                    :label="$t('student.coursesInterest')"
                    use-chips
                    use-input
                    @filter="filterFn"
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
