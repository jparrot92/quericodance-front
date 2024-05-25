<script setup lang="ts">
import { watch, onMounted, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DanceRole } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import { MembershipDTO, MembershipViewDTO } from '../../models/membership';
import useMemberships from 'src/modules/students/composables/useMemberships';

import useActivities from 'src/modules/activities/composables/useActivities';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import { MembershipActivityDTO } from '../../models/membershipActivity';

const props = withDefaults(
    defineProps<{
        membershipStudent: MembershipDTO;
    }>(),
    {}
);
const emits = defineEmits(['previousStep', 'nextStep']);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const { membership } = useMemberships();
const { activities, activityStudent, loadActivities } = useActivities();

const roles = generateEnumOptions(DanceRole);
const numActivities = ref<number>(3);

const addActivity = () => {
    membership.value.membershipActivities?.push({
        membershipId: 0,
        activityId: 0,
        danceRole: '',
    });
};

const removeActivity = (index: number) => {
    membership.value.membershipActivities?.splice(index, 1);
};

onMounted(() => {
    loadActivities();

    if (props.membershipStudent) {
        membership.value = props.membershipStudent;
    }
});
</script>

<template>
    <q-form
        v-for="(activityStudent, index) in membership.membershipActivities"
        :key="index"
    >
        <q-select
            v-model="activityStudent.activity"
            :label="$t('student.label.course')"
            :options="activities"
            :option-value="'id'"
            @update:model-value="
                activityStudent &&
                    (activityStudent.activityId = activityStudent.activity.id)
            "
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

        <pd-select
            v-model="activityStudent.danceRole"
            :label="$t('student.role')"
            :options="roles"
        />

        <q-btn
            color="negative"
            icon="clear"
            v-on:click="removeActivity(index)"
            label="Remove"
        />
    </q-form>

    <q-stepper-navigation>
        <q-btn @click="emits('nextStep')" color="primary" label="Continue" />
        <q-btn
            @click="addActivity"
            color="primary"
            label="Add"
            class="q-ml-sm"
        />
        <q-btn
            flat
            @click="emits('previousStep')"
            color="primary"
            label="Back"
            class="q-ml-sm"
        />
    </q-stepper-navigation>
</template>
