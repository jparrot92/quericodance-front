<script setup lang="ts">
import { onMounted, watch } from 'vue';
import usePayments from '../../composables/usePayments';

const props = withDefaults(
    defineProps<{
        period: string;
    }>(),
    {}
);

const { totals, loadTotalAmounts } = usePayments();

const periodFormatRegex = /^\d{2}\/\d{4}$/;

watch(
    () => props.period,
    (newPeriod) => {
        if (periodFormatRegex.test(newPeriod)) {
            loadTotalAmounts(newPeriod);
        }
    }
);

onMounted(() => {
    loadTotalAmounts(props.period);
});
</script>

<template>
    <div class="row">
        <div class="col q-pa-xs">
            <q-card flat bordered>
                <q-card-section class="text-h6 text-center bg-red text-white">
                    Total Pendiente
                </q-card-section>
                <q-separator />
                <q-card-section class="flex flex-center">
                    <div>{{ totals?.pendingTotal || 0 }} €</div>
                </q-card-section>
            </q-card>
        </div>
        <div class="col q-pa-xs">
            <q-card flat bordered>
                <q-card-section class="text-h6 text-center bg-green text-white">
                    Total Pagado
                </q-card-section>
                <q-separator />
                <q-card-section class="flex flex-center">
                    <div>{{ totals?.payedTotal || 0 }} €</div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>
