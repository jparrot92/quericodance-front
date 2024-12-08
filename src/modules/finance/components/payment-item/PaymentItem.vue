<script setup lang="ts">
import { format } from '@formkit/tempo';
import { PaymentDTO } from 'src/model/finance.model';
import useStudents from 'src/modules/students/composables/useStudents';

const props = withDefaults(
    defineProps<{
        paymentItem: PaymentDTO;
    }>(),
    {}
);

const { isPaymentStatusPaid } = useStudents();
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple>
            <q-item-section avatar top v-if="props.paymentItem.student?.user">
                <q-avatar v-if="props.paymentItem.student?.user.photo">
                    <img :src="props.paymentItem.student.user.photo" />
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
                            <template v-if="props.paymentItem.student?.user">
                                {{ props.paymentItem.student.user.name }}
                            </template>
                            <template v-else>
                                <q-badge
                                    color="grey"
                                    :label="$t('finance.studentRemoved')"
                                />
                            </template>

                            {{ props.paymentItem.student?.user.name }}
                            {{ props.paymentItem.student?.user.surnames }}
                        </div>
                        <div class="col-2 flex justify-end">
                            <q-badge
                                color="blue"
                                :label="
                                    $t(
                                        'shared.enum.' +
                                            props.paymentItem.paymentType
                                    )
                                "
                            />
                        </div>
                    </div>
                </q-item-label>
                <q-item-label lines="1">
                    <div class="flex justify-between">
                        <q-badge
                            :color="
                                isPaymentStatusPaid(props.paymentItem.status)
                                    ? 'green'
                                    : 'red'
                            "
                            :label="`${props.paymentItem.amount} €`"
                        />
                        <q-badge
                            :color="
                                isPaymentStatusPaid(props.paymentItem.status)
                                    ? 'green'
                                    : 'red'
                            "
                            :label="
                                $t('shared.enum.' + props.paymentItem.status)
                            "
                        />

                        <template v-if="props.paymentItem.paymentDate">
                            {{ format(props.paymentItem.paymentDate, 'short') }}
                        </template>
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
