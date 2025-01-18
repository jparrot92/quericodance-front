<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CourseDTO } from 'src/model/activity.model';

import useCourses from 'src/modules/activities/composables/useCourses';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        courseAbsence: CourseDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'addCourseAbsence']);

const { t } = useI18n();
const { saveCourseAbsence } = useCourses();

const dateAbsence = ref<string>(new Date().toISOString());
const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const addCourseAbsence = async () => {
    const newCourseAbsence = await saveCourseAbsence(
        props.idStudent,
        props.courseAbsence.id,
        dateAbsence.value
    );
    if (newCourseAbsence) {
        emits('addCourseAbsence', newCourseAbsence);
    }
};
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">{{ $t('student.addAbsence') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <pd-field
                    :label="$t('student.course')"
                    :value="
                        props.courseAbsence.name +
                        ' ' +
                        props.courseAbsence.level +
                        ' - ' +
                        t('shared.enum.' + props.courseAbsence.day) +
                        ' ' +
                        props.courseAbsence.startHour
                    "
                />

                <pd-date
                    :label="$t('student.dateAbsence') + '*'"
                    v-model="dateAbsence"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('shared.add')"
                    color="primary"
                    @click="addCourseAbsence()"
                />
                <q-btn
                    flat
                    :label="$t('shared.cancel')"
                    color="primary"
                    @click="emits('close')"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
