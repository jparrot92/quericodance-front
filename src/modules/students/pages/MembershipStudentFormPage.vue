<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import { format } from '@formkit/tempo';
import { useI18n } from 'vue-i18n';

import { PaymentsStatus } from 'src/types/UtilTypes';
import { PaymentFrequency } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MembershipStudentDialog from '../components/MembershipStudentDialog.vue';
import { MembershipViewDTO } from '../models/membership';

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membership: MembershipViewDTO;
    }>(),
    {}
);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const showModalMembership = ref(false);

const paymentStatuses = generateEnumOptions(PaymentsStatus);

const membership = ref<MembershipViewDTO>(props.membership);

const paymentFrequency = computed<string>(() => {
    if (membership.value.paymentFrequency === PaymentFrequency.TRIMESTRAL) {
        return t('shared.enum.' + PaymentFrequency.TRIMESTRAL);
    }
    return t('shared.enum.' + PaymentFrequency.MONTHLY);
});

const paymentDate = computed<string>(() => {
    return format(membership.value.paymentDate);
});

const updateMembership = async (membershipView: MembershipViewDTO) => {
    membership.value = membershipView;
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <q-card v-if="membership" flat>
                    <q-input
                        :readonly="true"
                        :label="$t('student.tariff')"
                        v-model="membership.tariff.name"
                    />

                    <q-input
                        :readonly="true"
                        :label="$t('student.paymentFrequency')"
                        v-model="paymentFrequency"
                    />

                    <q-input
                        :readonly="true"
                        :label="$t('student.payment')"
                        v-model="membership.payment"
                    />

                    <pd-select
                        v-model="membership.paymentStatus"
                        :label="$t('student.paymentStatus')"
                        :options="paymentStatuses"
                    />

                    <q-input
                        :readonly="true"
                        :label="$t('student.paymentDate')"
                        v-model="paymentDate"
                    />
                </q-card>

                <q-card flat v-else>
                    {{ $t('student.notMembership') }}
                </q-card>
                <q-btn
                    :label="
                        membership
                            ? $t('student.editMembership')
                            : $t('student.addMembership')
                    "
                    color="primary"
                    class="full-width"
                    rounded
                    @click="showModalMembership = true"
                />
            </div>
        </div>
    </q-page>

    <MembershipStudentDialog
        v-if="showModalMembership"
        :id-student="props.idStudent"
        :membership-student="membership"
        @close="showModalMembership = false"
        @update-membership="updateMembership"
    />
</template>
