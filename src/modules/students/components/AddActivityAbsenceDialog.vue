<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ActivityDTO } from 'src/model/activity.model';

import useActivities from 'src/modules/activities/composables/useActivities';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        activityAbsence: ActivityDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'addActivityAbsence']);

const { t } = useI18n();
const { saveActivityAbsence } = useActivities();

const dateAbsence = ref<string>(new Date().toISOString());
const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const addActivityAbsence = async () => {
    const newActivityAbsence = await saveActivityAbsence(
        props.idStudent,
        props.activityAbsence.id,
        dateAbsence.value
    );
    if (newActivityAbsence) {
        emits('addActivityAbsence', newActivityAbsence);
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
                        props.activityAbsence.name +
                        ' ' +
                        props.activityAbsence.level +
                        ' - ' +
                        t('shared.enum.' + props.activityAbsence.day) +
                        ' ' +
                        props.activityAbsence.startHour
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
                    @click="addActivityAbsence()"
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
