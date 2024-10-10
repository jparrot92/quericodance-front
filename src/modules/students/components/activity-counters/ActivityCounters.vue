<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useActivities from 'src/modules/activities/composables/useActivities';

const props = withDefaults(
    defineProps<{
        idActivity: number;
    }>(),
    {}
);

const { activityCounters, loadCountersActivity } = useActivities();

const showProfitability = ref<boolean>(false);

onMounted(async () => {
    await loadCountersActivity(props.idActivity);
});
</script>
<template>
    <div class="row">
        <q-toggle
            class="h-2-5rem"
            :label="$t('activity.showProfitability')"
            v-model="showProfitability"
        ></q-toggle>
    </div>
    <div class="row">
        <div class="col q-pa-xs">
            <q-card flat bordered>
                <q-card-section class="text-h6 text-center bg-blue text-white">
                    {{ $t('activity.numberLeaders') }}
                </q-card-section>
                <q-separator />
                <q-card-section class="flex flex-center">
                    <div>{{ activityCounters.numberLeaders }}</div>
                </q-card-section>
            </q-card>
        </div>
        <div class="col q-pa-xs">
            <q-card flat bordered>
                <q-card-section class="text-h6 text-center bg-pink text-white">
                    {{ $t('activity.numberFollowers') }}
                </q-card-section>
                <q-separator />
                <q-card-section class="flex flex-center">
                    <div>{{ activityCounters.numberFollowers }}</div>
                </q-card-section>
            </q-card>
        </div>
        <template v-if="showProfitability">
            <div class="col q-pa-xs">
                <q-card flat bordered>
                    <q-card-section
                        class="text-h6 text-center bg-green text-white"
                    >
                        {{ $t('activity.costEffectiveness') }}
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center">
                        <div>{{ activityCounters.costEffectiveness }} €</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col q-pa-xs">
                <q-card flat bordered>
                    <q-card-section
                        class="text-h6 text-center bg-green text-white"
                    >
                        {{ $t('activity.totalPaid') }}
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center">
                        <div>{{ activityCounters.totalPaid }} €</div>
                    </q-card-section>
                </q-card>
            </div>
        </template>
    </div>
</template>
