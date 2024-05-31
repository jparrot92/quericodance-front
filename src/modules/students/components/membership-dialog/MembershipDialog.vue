<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import StepTariff from './StepTariff.vue';
import StepActivityStudent from './StepActivityStudent.vue';
import StepMembershipSummary from './StepMembershipSummary.vue';
import { MembershipDTO, MembershipViewDTO } from '../../models/membership';
import useMemberships from 'src/modules/students/composables/useMemberships';
import { MembershipActivityViewDTO } from '../../models/membershipActivity';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membershipStudent: MembershipViewDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'update-membership']);

const { membership, membershipView, saveMembership, editMembership } =
    useMemberships();

const isDialogVisible: Ref<boolean> = ref<boolean>(true);
const step: Ref<number> = ref<number>(1);
const done1: Ref<boolean> = ref<boolean>(false);
const done2: Ref<boolean> = ref<boolean>(false);

const handleMembership = async () => {
    if (props.membershipStudent) {
        await editMembership(props.membershipStudent.id);
    } else {
        await saveMembership();
    }

    if (membershipView.value) {
        emits('update-membership', membershipView.value);
        emits('close');
    }
};

onMounted(() => {
    membership.value.studentId = props.idStudent;
    if (props.membershipStudent) {
        membership.value = {
            id: props.membershipStudent.id,
            studentId: props.idStudent,
            tariffId: props.membershipStudent.tariff.id,
            paymentFrequency: props.membershipStudent.paymentFrequency,
            membershipActivities:
                props.membershipStudent.membershipActivities.map(
                    (item: MembershipActivityViewDTO) => ({
                        membershipId: props.membershipStudent.id,
                        activityId: item.activity.id,
                        danceRole: item.danceRole,
                    })
                ),
        };
    }
});
</script>
<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-stepper
            v-model="step"
            header-nav
            ref="stepper"
            color="primary"
            animated
            style="width: 700px; max-width: 80vw"
        >
            <q-step
                :name="1"
                :title="$t('student.tariff')"
                icon="settings"
                :done="step > 1"
                :header-nav="step > 1"
            >
                <step-tariff
                    :membership-student="membership"
                    @close="emits('close')"
                    @next-step="
                        () => {
                            done1 = true;
                            step = 2;
                        }
                    "
                />
            </q-step>

            <q-step
                :name="2"
                :title="$t('student.courses')"
                icon="create_new_folder"
                :done="step > 2"
                :header-nav="step > 2"
            >
                <step-activity-student
                    :membership-student="membership"
                    @close="emits('close')"
                    @next-step="
                        () => {
                            done2 = true;
                            step = 3;
                        }
                    "
                    @previous-step="step = 1"
                />
            </q-step>

            <q-step
                :name="3"
                :title="$t('student.summary')"
                icon="add_comment"
                :header-nav="step > 3"
            >
                <step-membership-summary
                    :membership-student="membership"
                    @close="emits('close')"
                    @next-step="handleMembership()"
                    @previous-step="step = 2"
                />
            </q-step>
        </q-stepper>
    </q-dialog>
</template>
