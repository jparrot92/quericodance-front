<script setup lang="ts">
import { PaymentDTO } from '../../models/payment';

const props = withDefaults(
    defineProps<{
        paymentItem: PaymentDTO;
    }>(),
    {}
);
</script>

<template>
    <div padding class="full-width">
        <q-item clickable v-ripple>
            <q-item-section>
                <q-item-label lines="1">
                    {{ props.paymentItem.amount }}
                </q-item-label>
            </q-item-section>
            <q-item-section side top>
                <slot name="menu"> </slot>
            </q-item-section>
        </q-item>
        <q-separator />
    </div>
</template>
