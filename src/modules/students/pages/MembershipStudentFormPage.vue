<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { format } from '@formkit/tempo';
import { useI18n } from 'vue-i18n';

import { PaymentsStatus } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
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
const expanded = ref(false);

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
                        :value="format(membership.paymentDate)"
                    />

                    <q-card-actions class="bg-primary text-white q-mt-md">
                        <div class="text-weight-medium">
                            {{ t('student.courses') }}
                        </div>

                        <q-space />

                        <q-btn
                            color="grey"
                            round
                            flat
                            dense
                            :icon="
                                expanded
                                    ? 'keyboard_arrow_up'
                                    : 'keyboard_arrow_down'
                            "
                            @click="expanded = !expanded"
                        />
                    </q-card-actions>

                    <q-slide-transition>
                        <div v-show="expanded">
                            <q-list
                                v-if="membership.membershipActivities"
                                bordered
                                class="rounded-borders"
                            >
                                <template
                                    v-for="(
                                        item, index
                                    ) in membership.membershipActivities"
                                    :key="item.id"
                                >
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label lines="1">
                                                <span
                                                    class="text-weight-medium"
                                                >
                                                    {{
                                                        $t(
                                                            'activity.label.activity'
                                                        )
                                                    }}
                                                    {{ item.activity.name }}
                                                    {{ item.activity.level }}
                                                </span>
                                                <span class="text-grey-8">
                                                    -
                                                    {{
                                                        t(
                                                            'shared.enum.' +
                                                                item.activity
                                                                    .day
                                                        )
                                                    }}
                                                    {{
                                                        item.activity.startHour
                                                    }}
                                                </span>
                                            </q-item-label>
                                            <q-item-label caption lines="1">
                                                {{ item.danceRole }}
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-separator
                                        spaced
                                        v-if="
                                            index <
                                            membership.membershipActivities
                                                .length -
                                                1
                                        "
                                    />
                                </template>
                            </q-list>
                        </div>
                    </q-slide-transition>
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

    <MembershipDialog
        v-if="showModalMembership"
        :id-student="props.idStudent"
        :membership-student="membership"
        @close="showModalMembership = false"
        @update-membership="updateMembership"
    />
</template>
