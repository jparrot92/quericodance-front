<script setup lang="ts">
import { onMounted, defineProps, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { DanceRole } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useActivities from 'src/modules/activities/composables/useActivities';

const props = withDefaults(
    defineProps<{
        idStudent: number;
    }>(),
    {}
);

const emits = defineEmits(['close', 'addActivityStudent']);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const { activities, activityStudent, loadActivities, saveActivityStudent } =
    useActivities();

const danceRoles = generateEnumOptions(DanceRole);

const activityId = ref<number>(0);
const danceRole = ref<string>('');
const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const addActivityStudent = async () => {
    activityId.value = activityStudent.value.activity.id;
    danceRole.value = activityStudent.value.danceRole;

    const newActivityStudent = await saveActivityStudent(
        props.idStudent,
        activityId.value,
        danceRole.value
    );
    if (newActivityStudent) {
        emits('addActivityStudent', newActivityStudent);
    }
};

onMounted(() => {
    loadActivities();
});
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">{{ $t('student.addActivity') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <q-select
                    v-model="activityStudent.activity"
                    :label="$t('student.course')"
                    :options="activities"
                    :option-value="'id'"
                >
                    <template v-slot:selected-item="{ opt }">
                        {{
                            activityStudent.activity.id !== 0
                                ? opt.name +
                                  ' ' +
                                  opt.level +
                                  ' - ' +
                                  t('shared.enum.' + opt.day) +
                                  ' ' +
                                  opt.startHour
                                : ''
                        }}
                    </template>
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
                </q-select>

                <q-select
                    v-model="activityStudent.danceRole"
                    :options="danceRoles"
                    :label="$t('student.role')"
                    emit-value
                />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('shared.add')"
                    color="primary"
                    @click="addActivityStudent()"
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
