<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { format } from '@formkit/tempo';

import { Status, Option, PaymentsStatus } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useStudents from '../../composables/useStudents';
import { StudentDTO } from '../../models/student';

const props = withDefaults(
    defineProps<{
        studentItem: StudentDTO;
        checkMonthlyPaymentPaid: (
            student: StudentDTO,
            paymentStatus: Option
        ) => Promise<void>;
        handleSendMail: (student: StudentDTO) => Promise<void>;
    }>(),
    {}
);

const { t } = useI18n();
const router = useRouter();
const { generateEnumOptions } = useEnumOptions();

const { isPaymentStatusPaid, getStatusColor, getPaymentsStatusColor } =
    useStudents();

const paymentStatuses = generateEnumOptions(PaymentsStatus);

const student = ref<StudentDTO>(props.studentItem);

const handleItemClick = async (id: number) => {
    router.push({
        name: 'students-edit',
        params: {
            id,
        },
    });
};
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple @click="handleItemClick(student.id)">
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
                    <div class="row">
                        <div class="col-10 ellipsis q-pr-xs">
                            {{ student.user.name }}
                            {{ student.user.surnames }}
                        </div>
                        <div class="col-2 flex justify-end">
                            <q-badge
                                :color="getStatusColor(student.status)"
                                :label="$t('shared.enum.' + student.status)"
                            />
                        </div>
                    </div>
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
                    <span
                        v-if="
                            student.membership?.paymentStatus ===
                            PaymentsStatus.PAYED
                        "
                    >
                        {{ t('student.payment') }}
                    </span>
                    <span
                        v-else-if="
                            student.membership?.paymentStatus ===
                            PaymentsStatus.PENDING
                        "
                    >
                        {{ t('student.owe') }}
                    </span>

                    <q-badge
                        class="q-mx-xs"
                        v-if="student.membership"
                        :color="
                            getPaymentsStatusColor(
                                student.membership?.paymentStatus
                            )
                        "
                        :label="student.membership.payment"
                    />

                    <template v-if="student.membership">
                        {{
                            isPaymentStatusPaid(
                                student.membership?.paymentStatus
                            ) && student.membership?.paymentDate
                                ? format(
                                      student.membership?.paymentDate,
                                      'short'
                                  )
                                : ''
                        }}
                    </template>
                </q-item-label>
                <q-item-label caption lines="3">
                    <div class="row items-center no-wrap">
                        <div class="col-6 q-pr-xs" @click.stop>
                            <q-select
                                v-if="student.membership"
                                :bg-color="
                                    isPaymentStatusPaid(
                                        student.membership.paymentStatus
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
                                    checkMonthlyPaymentPaid(student, $event)
                                "
                            >
                                <template v-slot:selected-item="{ opt }">
                                    {{ t('shared.enum.' + (opt.value || opt)) }}
                                </template>
                            </q-select>
                        </div>
                        <div class="col-6 q-pl-xs" @click.stop>
                            <q-btn
                                v-if="
                                    isPaymentStatusPaid(
                                        student.membership?.paymentStatus
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
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator inset="item" />
    </div>
</template>
