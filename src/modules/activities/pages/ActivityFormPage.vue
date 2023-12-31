<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import DaysSelector from 'src/shared/components/DaysSelector.vue';

import useTeachers from 'src/modules/teachers/composables/useTeachers';
import useActivities from '../composables/useActivities';

const route = useRoute();

const { id } = route.params as { id: string };

const isUpdate = computed(() => route.params.id);

const { teachers, loadTeachers } = useTeachers();
const { activity, loadActivity, saveActivity, editActivity } = useActivities();

onMounted(() => {
    loadTeachers();
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

const removeTeacherActivity = async () => {
    console.log('Elinar del chip');
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
                    v-model.number="activity.level"
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

                <div class="row">
                    <q-input
                        :label="$t('activity.label.color')"
                        v-model="activity.color"
                        class="col-md-11 col-sm-11 col-xs-10"
                    >
                        <template v-slot:append>
                            <q-icon name="colorize" class="cursor-pointer">
                                <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                >
                                    <q-color v-model="activity.color" />
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>

                    <q-btn
                        :style="{ 'background-color': activity.color }"
                        class="col-md-1 col-sm-1 col-xs-2"
                    >
                        <q-tooltip
                            anchor="center left"
                            self="center right"
                            :offset="[10, 10]"
                        >
                            {{ $t('activity.label.infoColor') }}
                        </q-tooltip>
                    </q-btn>
                </div>

                <q-select
                    v-model="activity.teachersIds"
                    multiple
                    :options="teachers"
                    :label="$t('activity.label.teachers')"
                    emit-value
                    map-options
                    :option-value="'id'"
                >
                    <template v-slot:selected-item="{ opt }">
                        <q-chip
                            removable
                            :label="opt.user.name"
                            @remove="removeTeacherActivity"
                        />
                    </template>
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                {{ opt.user.name }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

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
