<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { format } from '@formkit/tempo';
import { useI18n } from 'vue-i18n';

import { PaymentsStatus } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MembershipDialog from '../components/MembershipDialog.vue';

import { MembershipViewDTO } from '../models/membership';

const emits = defineEmits(['update-membership']);

const props = withDefaults(
    defineProps<{
        idStudent: number;
        membership?: MembershipViewDTO;
    }>(),
    {}
);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const showModalMembership = ref(false);

const paymentStatuses = generateEnumOptions(PaymentsStatus);

const membership = ref<MembershipViewDTO>(props.membership);

const updateMembership = async (membershipView: MembershipViewDTO) => {
    membership.value = membershipView;
    emits('update-membership', membershipView);
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <q-card v-if="membership" flat>
                    <pd-field
                        :label="$t('student.tariff')"
                        :value="membership.tariff.name"
                    />

                    <pd-field
                        :label="$t('student.paymentFrequency')"
                        :value="t('shared.enum.' + membership.paymentFrequency)"
                    />

                    <pd-field
                        :label="$t('student.payment')"
                        :value="membership.payment"
                    />

                    <pd-select
                        v-model="membership.paymentStatus"
                        :label="$t('student.paymentStatus')"
                        :options="paymentStatuses"
                    />

                    <pd-field
                        :label="$t('student.paymentDate')"
                        :value="
                            membership.paymentDate
                                ? format(membership.paymentDate)
                                : '-'
                        "
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

    <membership-dialog
        v-if="showModalMembership"
        :id-student="props.idStudent"
        :membership-student="membership"
        @close="showModalMembership = false"
        @update-membership="updateMembership"
    />
</template>
