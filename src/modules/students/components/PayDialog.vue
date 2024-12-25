<script setup lang="ts">
import { defineProps, reactive, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PayType } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import { StudentDTO } from 'src/model/student.model';

import useActivities from 'src/modules/activities/composables/useActivities';
import useStudents from 'src/modules/students/composables/useStudents';
import { PaymentDTO } from 'src/model/finance.model';

const props = withDefaults(
    defineProps<{
        studentSelected: StudentDTO;
    }>(),
    {}
);

const emits = defineEmits(['close', 'addActivityAbsence']);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const { saveActivityAbsence } = useActivities();
const {
    loading,
    students,
    loadStudents,
    removeStudent,
    markPaymentPaid,
    sendMailPaymentPaid,
    cancelPaymentPaid,
    isPaymentStatusPaid,
    getStatusColor,
    getPaymentsStatusColor,
} = useStudents();

const payTypes = generateEnumOptions(PayType);

const dateAbsence = ref<string>(new Date().toISOString());
const isDialogVisible: Ref<boolean> = ref<boolean>(true);

const payment = reactive<PaymentDTO>({
    payType: PayType.BANK_TRANSFER,
});

const addActivityAbsence = async () => {
    const newActivityAbsence = await markPaymentPaid(
        props.studentSelected.id,
        payment
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
                <pd-select
                    :dense="false"
                    :options-dense="false"
                    v-model="payment.payType"
                    :label="$t('student.role') + '*'"
                    :options="payTypes"
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
