<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

import useActivities from 'src/modules/activities/composables/useActivities';

const { activities, loadActivities } = useActivities();

onMounted(() => {
    loadActivities();
});

interface PhoneNumberLine {
    activityCode: string | null;
    phoneUsageType: string | null;
}

const lines = ref<PhoneNumberLine[]>([]);
const blockRemoval = ref(true);

const phoneUsageTypes = [
    { label: 'Lider', value: 'leader' },
    { label: 'Follower', value: 'follower' }
];

const addLine = () => {
    const checkEmptyLines = lines.value.filter(
        (line) => line.activityCode === null
    );
    if (checkEmptyLines.length >= 1 && lines.value.length > 0) {
        return;
    }
    lines.value.push({
        activityCode: null,
        phoneUsageType: null
    });
};

const removeLine = (lineId: number) => {
    if (!blockRemoval.value) {
        lines.value.splice(lineId, 1);
    }
};

watch(lines, () => {
    blockRemoval.value = lines.value.length <= 1;
});

onMounted(() => {
    addLine();
});
</script>

<template>
    <q-expansion-item
        class="shadow-1 overflow-hidden"
        style="border-radius: 30px"
        icon="explore"
        label="Counter"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
    >
        <q-card>
            <q-card-section>
                <div v-for="(line, index) in lines" :key="index" class="row">
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-12">
                                <q-select
                                    v-model="line.activityCode"
                                    label="Country Code"
                                    :options="activities"
                                    :option-value="'id'"
                                    :option-label="'name'"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <q-select
                            v-model="line.phoneUsageType"
                            label="Type of Usage"
                            :options="phoneUsageTypes"
                        />
                    </div>

                    <div class="col-lg-2">
                        <div class="block float-right">
                            <q-btn
                                round
                                @click="removeLine(index)"
                                icon="delete"
                            />
                            <q-btn
                                round
                                v-if="index + 1 === lines.length"
                                @click="addLine"
                                icon="playlist-plus"
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-expansion-item>
</template>
