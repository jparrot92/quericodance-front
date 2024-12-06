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
const { student, uniqueFields, saveStudent, editStudent } = useStudents();

const props = withDefaults(
    defineProps<{
        initialStudent?: StudentDTO;
    }>(),
    {
        initialStudent: () => ({
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

student.value = props.initialStudent;
uniqueFields.email = props.initialStudent.user.email ?? '';
uniqueFields.phone = props.initialStudent.user.phone ?? '';

const activitiesFiltered = ref<ActivityListViewDTO[]>([]);

const removeCoursesInterest = (idActivity: number) => {
    const index = student.value.interestedActivities?.findIndex(
        (student: ActivityDTO) => student.id === idActivity
    );
    if (index !== undefined && index !== -1) {
        student.value.interestedActivities?.splice(index, 1);
    }
};

const onSubmit = () => {
    if (props.initialStudent.id !== 0) {
        editStudent(props.initialStudent.id);
    } else {
        saveStudent(student.value);
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
                        v-if="student.user.id"
                        :id="student.user.id"
                        :photo="student.user.photo"
                    />
                </div>

                <q-input
                    :label="$t('shared.name') + '*'"
                    v-model="student.user.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <q-input
                    :label="$t('user.surnames') + '*'"
                    v-model="student.user.surnames"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <pd-date
                    :label="$t('user.dateOfBirth') + '*'"
                    v-model="student.user.dateOfBirth"
                />

                <pd-phone-input
                    :label="$t('user.phone') + '*'"
                    v-model="student.user.phone"
                    :required="true"
                />

                <q-input
                    :label="$t('user.instagram')"
                    v-model="student.user.instagram"
                />

                <q-input
                    :label="$t('user.email') + '*'"
                    v-model="student.user.email"
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
                    v-model="student.user.password"
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
                    v-model="student.interestedActivities"
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
