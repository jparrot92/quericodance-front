<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { format } from '@formkit/tempo';

import { Status, Option, PaymentsStatus } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useStudents from '../../composables/useStudents';
import { StudentDTO } from '../../models/student';
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        studentItem: StudentDTO;
        getStatusColor: (status: Status) => string;
        checkMonthlyPaymentPaid: (
            student: StudentDTO,
            paymentStatus: Option
        ) => Promise<void>;
        handleSendMail: (student: StudentDTO) => Promise<void>;
    }>(),
    {}
);

const { t } = useI18n();
const { generateEnumOptions } = useEnumOptions();

const { isPaymentStatusPaid } = useStudents();

const paymentStatuses = generateEnumOptions(PaymentsStatus);

const student = ref<StudentDTO>(props.studentItem);
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple>
            <q-item-section avatar top>
                <q-avatar v-if="student.user.photo">
                    <img :src="student.user.photo" />
                </q-avatar>
                <q-avatar
                    v-else
                    color="grey"
                    text-color="white"
                    icon="mdi-image-off"
                />
            </q-item-section>

            <q-item-section>
                <q-item-label lines="1">
                    {{ student.user.name }}
                    {{ student.user.surnames }}

                    <q-badge
                        :color="getStatusColor(student.status)"
                        :label="$t('shared.enum.' + student.status)"
                    />
                </q-item-label>
                <q-item-label lines="1">
                    <a
                        @click.stop
                        :href="'https://wa.me/' + student.user.phone"
                        target="_blank"
                    >
                        {{ student.user.phone }}
                    </a>
                </q-item-label>
                <q-item-label lines="2">
                    {{ t('pago') }}
                    <q-badge
                        v-if="student.membership"
                        :color="
                            isPaymentStatusPaid(
                                student.membership?.paymentStatus
                            )
                                ? 'green'
                                : 'red'
                        "
                        :label="student.membership.payment"
                    />

                    {{ t('el') }}

                    <template v-if="student.membership">
                        {{
                            isPaymentStatusPaid(
                                student.membership?.paymentStatus
                            )
                                ? format(
                                      student.membership.datePayment,
                                      'short'
                                  )
                                : '-'
                        }}
                    </template>
                </q-item-label>
                <q-item-label caption lines="3">
                    <div class="row items-center no-wrap">
                        <div class="col-6 q-pr-xs">
                            <q-select
                                v-if="student.membership"
                                :bg-color="
                                    isPaymentStatusPaid(
                                        student.membership.paymentStatus || ''
                                    )
                                        ? 'green'
                                        : 'red'
                                "
                                v-model="student.membership.paymentStatus"
                                rounded
                                outlined
                                dense
                                options-dense
                                :options="paymentStatuses"
                                @update:model-value="
                                    checkMonthlyPaymentPaid(
                                        student,
                                        student.membership.paymentStatus
                                    )
                                "
                            >
                                <template v-slot:selected-item="{ opt }">
                                    {{ t('shared.enum.' + (opt.value || opt)) }}
                                </template>
                            </q-select>
                        </div>
                        <div class="col-6 q-pl-xs">
                            <q-btn
                                v-if="
                                    student.membership?.paymentStatus &&
                                    isPaymentStatusPaid(
                                        student.membership.paymentStatus
                                    )
                                "
                                color="primary"
                                class="full-width"
                                rounded
                                size="md"
                                :label="$t('shared.send')"
                                @click="handleSendMail(student)"
                            />
                        </div>
                    </div>
                </q-item-label>
            </q-item-section>

            <q-item-section side top>
                <q-btn size="12px" flat dense round icon="more_vert" />
            </q-item-section>
        </q-item>
        <q-separator inset="item" />
    </div>
</template>
