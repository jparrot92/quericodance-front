<script setup lang="ts">
import { onMounted, defineProps, ref, Ref } from 'vue';
import { PaymentFrequency } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useTariffs from 'src/modules/services/modules/tariffs/composables/useTariffs';
import useMemberships from 'src/modules/students/composables/useMemberships';
import { MembershipViewDTO } from '../models/membership';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membershipStudent: MembershipViewDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'update-membership']);

const { generateEnumOptions } = useEnumOptions();
const { tariffs, tariff, loadTariffs } = useTariffs();
const { membership, membershipView, saveMembership, editMembership } =
    useMemberships();

const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const paymentFrequency = generateEnumOptions(PaymentFrequency);

const handleMembership = async () => {
    if (props.membershipStudent) {
        await editMembership(props.membershipStudent.id);
    } else {
        await saveMembership();
    }

    debugger;
    if (membershipView.value) {
        emits('update-membership', membershipView.value);
        emits('close');
    }
};

onMounted(() => {
    loadTariffs();

    membership.value.studentId = props.idStudent;

    if (props.membershipStudent) {
        tariff.value = props.membershipStudent.tariff;
        membership.value = {
            id: 0,
            studentId: props.idStudent,
            tariffId: props.membershipStudent.tariff.id,
            paymentFrequency: props.membershipStudent.paymentFrequency,
        };
    }
});
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 100vh">
            <q-card-section>
                <div class="text-h6">{{ $t('student.membership') }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 100vh" class="scroll">
                <q-select
                    v-model="tariff"
                    :label="$t('student.tariff')"
                    :options="tariffs"
                    :option-value="'id'"
                    @update:model-value="membership.tariffId = tariff.id"
                >
                    <template v-slot:selected-item="{ opt }">
                        {{ opt.name + ' - ' + opt.price + '€' }}
                    </template>
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                {{ opt.name + ' - ' + opt.price + '€' }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <pd-select
                    v-model="membership.paymentFrequency"
                    :label="$t('student.paymentFrequency')"
                    :options="paymentFrequency"
                />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="
                        props.membershipStudent
                            ? $t('shared.edit')
                            : $t('shared.save')
                    "
                    color="primary"
                    @click="handleMembership()"
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
