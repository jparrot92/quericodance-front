<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { format } from '@formkit/tempo';
import { useI18n } from 'vue-i18n';

import { PaymentsStatus } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import MembershipStudentDialog from '../components/MembershipStudentDialog.vue';
import MembershipDialog from '../components/membership-dialog/MembershipDialog.vue';

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

const updateMembership = async (membershipView: MembershipViewDTO) => {
    membership.value = membershipView;
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <q-card v-if="membership" flat>
                    <q-field :label="$t('student.tariff')" stack-label>
                        <template v-slot:control>
                            <div
                                class="self-center full-width no-outline"
                                tabindex="0"
                            >
                                {{ membership.tariff.name }}
                            </div>
                        </template>
                    </q-field>

                    <q-field
                        :label="$t('student.paymentFrequency')"
                        stack-label
                    >
                        <template v-slot:control>
                            <div
                                class="self-center full-width no-outline"
                                tabindex="0"
                            >
                                {{
                                    t(
                                        'shared.enum.' +
                                            membership.paymentFrequency
                                    )
                                }}
                            </div>
                        </template>
                    </q-field>

                    <q-field :label="$t('student.payment')" stack-label>
                        <template v-slot:control>
                            <div
                                class="self-center full-width no-outline"
                                tabindex="0"
                            >
                                {{ membership.payment }}
                            </div>
                        </template>
                    </q-field>

                    <pd-select
                        v-model="membership.paymentStatus"
                        :label="$t('student.paymentStatus')"
                        :options="paymentStatuses"
                    />

                    <q-field :label="$t('student.paymentDate')" stack-label>
                        <template v-slot:control>
                            <div
                                class="self-center full-width no-outline"
                                tabindex="0"
                            >
                                {{ format(membership.paymentDate) }}
                            </div>
                        </template>
                    </q-field>
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
