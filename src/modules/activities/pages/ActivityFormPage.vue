<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import DaysSelector from 'src/shared/components/DaysSelector.vue';

import useActivities from '../composables/useActivities';

const route = useRoute();

const { id } = route.params as { id: string };

const isUpdate = computed(() => route.params.id);

const { activity, loadActivity, saveActivity, editActivity } = useActivities();

onMounted(() => {
    if (isUpdate.value) {
        loadActivity(id);
    }
});

const onSubmit = async () => {
    if (isUpdate.value) {
        editActivity(id);
    } else {
        saveActivity();
    }
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <q-input
                    :label="$t('activity.label.name')"
                    v-model="activity.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('activity.validation.nameRequired')
                    ]"
                />

                <q-input
                    type="number"
                    :label="$t('activity.label.level')"
                    v-model="activity.level"
                    :rules="[
                        (val) =>
                            (val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== '') ||
                            $t('activity.validation.levelRequired'),
                        (val) =>
                            /^[0-9]+$/.test(val) ||
                            $t('activity.validation.levelNumeric')
                    ]"
                />

                <days-selector
                    :day="activity.day"
                    @update:model-value="
                        (newValue: any) =>
                            (activity.day = newValue.value)
                    "
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('activity.validation.dayRequired')
                    ]"
                />

                <div class="row">
                    <q-input
                        class="col-md-6 col-sm-6 col-xs-6 q-pr-md q-pr-sm"
                        :label="$t('activity.label.startHour')"
                        v-model="activity.startHour"
                        mask="time"
                        :rules="['time']"
                    >
                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                >
                                    <q-time v-model="activity.startHour">
                                        <div
                                            class="row items-center justify-end"
                                        >
                                            <q-btn
                                                v-close-popup
                                                label="Close"
                                                color="primary"
                                                flat
                                            />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>

                    <q-input
                        class="col-md-6 col-sm-6 col-xs-6 q-pl-md q-pl-sm"
                        :label="$t('activity.label.endHour')"
                        v-model="activity.endHour"
                        mask="time"
                        :rules="['time']"
                    >
                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                >
                                    <q-time v-model="activity.endHour">
                                        <div
                                            class="row items-center justify-end"
                                        >
                                            <q-btn
                                                v-close-popup
                                                label="Close"
                                                color="primary"
                                                flat
                                            />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>

                <q-input
                    type="number"
                    :label="$t('activity.label.numberPlaces')"
                    v-model.number="activity.numberPlaces"
                    :rules="[
                        (val) =>
                            (val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== '') ||
                            $t('activity.validation.numberPlacesRequired'),
                        (val) =>
                            /^[0-9]+$/.test(val) ||
                            $t('activity.validation.numberPlacesNumeric')
                    ]"
                />

                <q-input
                    prefix="€"
                    :label="$t('activity.label.price')"
                    v-model.number="activity.price"
                    :rules="[
                        (val) =>
                            (val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== '') ||
                            $t('activity.validation.priceRequired')
                    ]"
                />

                <q-btn
                    :label="$t('activity.label.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
