<script setup lang="ts">
import { computed, defineProps, reactive, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PaymentsStatus, PayType } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import { StudentDTO } from 'src/model/student.model';

import useStudents from 'src/modules/students/composables/useStudents';
import { PaymentDTO } from 'src/model/finance.model';

const props = withDefaults(
    defineProps<{
        studentSelected: StudentDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'student-updated']);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const { markPaymentPaid, cancelPaymentPaid } = useStudents();

const payTypes = generateEnumOptions(PayType);

const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const payment = reactive<PaymentDTO>({
    paymentMethod: PayType.BANK_TRANSFER,
});

const title = computed<string>(() => {
    if (
        props.studentSelected.membership?.paymentStatus === PaymentsStatus.PAYED
    ) {
        return t('student.revokePayment');
    } else if (
        props.studentSelected.membership?.paymentStatus ===
        PaymentsStatus.PENDING
    ) {
        return t('student.confirmPayment');
    } else {
        return '';
    }
});

const handleAccept = async () => {
    let student: StudentDTO;
    if (
        props.studentSelected.membership?.paymentStatus === PaymentsStatus.PAYED
    ) {
        student = await cancelPaymentPaid(props.studentSelected.id);
    } else {
        student = await markPaymentPaid(props.studentSelected.id, payment);
    }

    emits('student-updated', student);
    emits('close');
};
</script>

<template>
    <q-dialog v-model="isDialogVisible" @hide="emits('close')">
        <q-card style="width: 50vh">
            <q-card-section>
                <div class="text-h6">{{ title }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 50vh" class="scroll">
                <template
                    v-if="
                        props.studentSelected.membership?.paymentStatus ===
                        PaymentsStatus.PAYED
                    "
                >
                    {{ $t('student.messageRevokePayment') }}
                </template>
                <template
                    v-else-if="
                        props.studentSelected.membership?.paymentStatus ===
                        PaymentsStatus.PENDING
                    "
                >
                    <pd-select
                        :dense="false"
                        :options-dense="false"
                        v-model="payment.paymentMethod"
                        :label="$t('student.paymentType') + '*'"
                        :options="payTypes"
                        :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                    />
                </template>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn
                    flat
                    :label="$t('shared.accept')"
                    color="primary"
                    @click="handleAccept"
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
