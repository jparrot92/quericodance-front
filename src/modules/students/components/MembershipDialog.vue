<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { PaymentFrequency } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import { MembershipViewDTO } from '../models/membership';
import useMemberships from 'src/modules/students/composables/useMemberships';
import { Tariff } from 'src/modules/services/modules/tariffs/models/tariff';
import useTariffs from 'src/modules/services/modules/tariffs/composables/useTariffs';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membershipStudent: MembershipViewDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'update-membership']);

const { generateEnumOptions } = useEnumOptions();
const { tariffs, loadTariffs } = useTariffs();

const paymentFrequency = generateEnumOptions(PaymentFrequency);
const tariff = ref<Tariff>();

const { membership, membershipView, saveMembership, editMembership } =
    useMemberships();

const isDialogVisible: Ref<boolean> = ref<boolean>(true);

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

onMounted(async () => {
    await loadTariffs();

    membership.value.studentId = props.idStudent;
    if (props.membershipStudent) {
        membership.value = {
            id: props.membershipStudent.id,
            studentId: props.idStudent,
            tariffId: props.membershipStudent.tariff.id,
            paymentFrequency: props.membershipStudent.paymentFrequency,
            discountPercentage: props.membershipStudent.discountPercentage,
            discountReason: props.membershipStudent.discountReason,
        };

        tariff.value = tariffs.value.find(
            (tariff) => tariff.id === membership.value.tariffId
        );
    }
});
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">
                    {{ $t('student.addMembership') }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form>
                    <q-select
                        v-model="tariff"
                        :label="$t('student.tariff')"
                        :options="tariffs"
                        :option-value="'id'"
                        @update:model-value="
                            tariff && (membership.tariffId = tariff.id)
                        "
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

                    <div class="row">
                        <q-input
                            class="col-md-3 col-sm-3 col-xs-3 q-pr-md q-pr-sm"
                            type="number"
                            v-model.number="membership.discountPercentage"
                            :label="$t('student.discountPercentage')"
                        />

                        <q-input
                            class="col-md-9 col-sm-9 col-xs-9 q-pl-md q-pl-sm"
                            v-model="membership.discountReason"
                            :label="$t('student.discountReason')"
                        />
                    </div>
                </q-form>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('student.label.add')"
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
