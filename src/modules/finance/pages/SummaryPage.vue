<script setup lang="ts">
import { Ref, onMounted, ref, watch } from 'vue';

import usePayments from '../composables/usePayments';

const { totals, loadTotalAmounts } = usePayments();

const period: Ref<string> = ref(getCurrentPeriod());

const periodFormatRegex = /^\d{2}\/\d{4}$/;

function getCurrentPeriod(): string {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${year}`;
}

watch(
    () => period.value,
    (newPeriod) => {
        if (periodFormatRegex.test(newPeriod)) {
            loadTotalAmounts(newPeriod);
        }
    }
);

onMounted(() => {
    loadTotalAmounts(period.value);
});
</script>

<template>
    <div class="q-pa-md">
        <div class="q-pl-md row items-center">
            <pd-date
                :label="$t('summay.period')"
                v-model="period"
                :is-period="true"
            />
        </div>

        <div class="row">
            <div class="q-pa-xs col-xs-6 col-sm-3 col-md-2">
                <q-card flat bordered>
                    <q-card-section class="text-center bg-red text-white">
                        {{ $t('summay.pendingTotal') }}
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center">
                        <div>{{ totals?.pendingTotal || 0 }} €</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="q-pa-xs col-xs-6 col-sm-3 col-md-2">
                <q-card flat bordered>
                    <q-card-section class="text-center bg-green text-white">
                        {{ $t('summay.payedTotal') }}
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center">
                        <div>{{ totals?.payedTotal || 0 }} €</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>
