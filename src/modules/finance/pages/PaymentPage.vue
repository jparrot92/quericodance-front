<script setup lang="ts">
import { Ref, ref } from 'vue';
import PaymentList from '../components/payment-list/PaymentList.vue';
import PaymentTotals from '../components/payment-totals/PaymentTotals.vue';

const period: Ref<string> = ref(getCurrentPeriod());

function getCurrentPeriod(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${year}`;
}
</script>

<template>
    <q-page padding>
        <div class="col-12">
            <div class="row">
                <pd-date
                    :label="$t('finance.period')"
                    v-model="period"
                    :is-period="true"
                />

                <q-space />
            </div>
        </div>
        <payment-totals :period="period" />
        <payment-list :period="period" />
    </q-page>
</template>
