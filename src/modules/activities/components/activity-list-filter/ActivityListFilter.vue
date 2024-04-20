<script setup lang="ts">
import { ref } from 'vue';
import useEnumOptions from 'src/shared/composables/useEnumOptions';
import { WeekDay } from 'src/types/UtilTypes';
import { ActivityFilter } from '../../models/activity';

interface Emits {
    (e: 'filterTable', activityFilter: ActivityFilter): void;
}

const emits = defineEmits<Emits>();

const { generateEnumOptions } = useEnumOptions();

const days = generateEnumOptions(WeekDay);

const activityFilter = ref<ActivityFilter>({
    textFilter: '',
    day: '',
    showProfitability: false,
});

const initDanceRole = () => {
    activityFilter.value.day = '';
    emits('filterTable', activityFilter.value);
};
</script>

<template>
    <div class="col-12">
        <div class="row">
            <q-input
                class="col-6"
                v-model="activityFilter.textFilter"
                dense
                :label="$t('shared.search')"
                :placeholder="$t('activity.label.serachPlaceholder')"
                @update:model-value="emits('filterTable', activityFilter)"
            />
            <pd-select
                class="q-ml-sm col-2"
                dense
                v-model="activityFilter.day"
                :label="$t('activity.label.day')"
                :options="days"
                @update:model-value="emits('filterTable', activityFilter)"
            >
                <template v-slot:append>
                    <q-icon
                        v-if="activityFilter.day !== null"
                        class="cursor-pointer"
                        name="clear"
                        @click.stop.prevent="initDanceRole"
                    />
                </template>
            </pd-select>
            <q-toggle
                class="col-3"
                :label="$t('activity.label.showProfitability')"
                v-model="activityFilter.showProfitability"
                @update:model-value="emits('filterTable', activityFilter)"
            ></q-toggle>
        </div>
    </div>
</template>
