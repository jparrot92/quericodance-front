<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue';
import { PaymentFrequency } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import { MembershipViewDTO } from 'src/model/finance.model';
import { TariffDTO } from 'src/model/tariff.model';

import useMemberships from 'src/modules/students/composables/useMemberships';
import useTariffs from 'src/modules/services/composables/useTariffs';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membershipStudent: MembershipViewDTO | null;
    }>(),
    {}
);

const emits = defineEmits(['close', 'update-membership']);

const { generateEnumOptions } = useEnumOptions();
const { tariffs, loadTariffs } = useTariffs();
const paymentFrequency = generateEnumOptions(PaymentFrequency);
const { membership, membershipView, saveMembership, editMembership } =
    useMemberships();

const isDialogVisible: Ref<boolean> = ref<boolean>(true);
const tariff = ref<TariffDTO>();

const totalPayment = computed(() => {
    if (!tariff.value || !membership.value) {
        return 0;
    }

    const basePrice = tariff.value.price ? tariff.value.price : 0;
    const discount = (membership.value.discountPercentage / 100) * basePrice;
    let finalPrice = basePrice - discount;

    if (membership.value.paymentFrequency === PaymentFrequency.TRIMESTRAL) {
        finalPrice = basePrice * 3 - discount * 3;
    }

    return finalPrice.toFixed(2);
});

const handleMembership = async () => {
    if (props.membershipStudent && props.membershipStudent.id) {
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
    if (
        props.membershipStudent &&
        props.membershipStudent.id &&
        props.membershipStudent.tariff
    ) {
        membership.value = {
            id: props.membershipStudent.id,
            studentId: props.idStudent,
            tariffId: props.membershipStudent.tariff.id,
            paymentFrequency:
                props.membershipStudent.paymentFrequency ??
                PaymentFrequency.MONTHLY,
            discountPercentage: props.membershipStudent.discountPercentage ?? 0,
            discountReason: props.membershipStudent.discountReason ?? '',
        };

        tariff.value = tariffs.value.find(
            (tariff: { id: number }) => tariff.id === membership.value.tariffId
        );
    }
});
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">
                    <template v-if="props.membershipStudent">
                        {{ $t('student.editMembership') }}
                    </template>
                    <template v-else>
                        {{ $t('student.addMembership') }}
                    </template>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form>
                    <div class="row">
                        <q-select
                            class="col-md-7 col-sm-7 col-xs-7 q-pr-md q-pr-sm"
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
                            class="col-md-5 col-sm-5 col-xs-5 q-pl-md q-pl-sm"
                            v-model="membership.paymentFrequency"
                            :label="$t('student.paymentFrequency')"
                            :options="paymentFrequency"
                            :dense="false"
                        />
                    </div>

                    <div class="row">
                        <q-input
                            class="col-md-3 col-sm-3 col-xs-3 q-pr-md q-pr-sm"
                            type="number"
                            v-model.number="membership.discountPercentage"
                            :label="$t('student.discountPercentage')"
                            prefix="%"
                        />

                        <q-input
                            class="col-md-9 col-sm-9 col-xs-9 q-pl-md q-pl-sm"
                            v-model="membership.discountReason"
                            :label="$t('student.discountReason')"
                        />
                    </div>

                    <q-input
                        prefix="€"
                        v-model="totalPayment"
                        :label="$t('student.payment')"
                        disable
                        readonly
                    />
                </q-form>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('shared.save')"
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
