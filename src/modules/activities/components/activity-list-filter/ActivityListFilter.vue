<script setup lang="ts">
import { ref } from 'vue';
import { ActivityFilter } from '../../models/activity';

interface Emits {
    (e: 'filterTable', activityFilter: ActivityFilter): void;
}

const emits = defineEmits<Emits>();

const activityFilter = ref<ActivityFilter>({
    textFilter: '',
});
</script>

<template>
    <div class="col-12">
        <div class="row">
            <q-input
                class="col-12"
                v-model="activityFilter.textFilter"
                dense
                :label="$t('shared.label.search')"
                :placeholder="$t('activity.label.serachPlaceholder')"
                @update:model-value="emits('filterTable', activityFilter)"
            />
        </div>
    </div>
</template>
