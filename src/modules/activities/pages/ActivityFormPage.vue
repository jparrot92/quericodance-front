<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import { ActivityType, WeekDay } from 'src/types/UtilTypes';
import useEnumOptions from 'src/shared/composables/useEnumOptions';

import useTeachers from 'src/modules/teachers/composables/useTeachers';
import useActivities from '../composables/useActivities';

const props = withDefaults(
    defineProps<{
        activityType?: ActivityType;
    }>(),
    {
        activityType: ActivityType.CLASS,
    }
);

const route = useRoute();
const { generateEnumOptions } = useEnumOptions();
const { teachers, loadTeachers } = useTeachers();
const { activity, loadActivity, saveActivity, editActivity } = useActivities();
const weekDays = generateEnumOptions(WeekDay);

const idActivity = computed<string>(() => route.params.id?.toString());

const onSubmit = async () => {
    if (idActivity.value) {
        editActivity(idActivity.value);
    } else {
        saveActivity();
    }
};

const removeTeacherActivity = async () => {
    console.log('Elinar del chip');
};

onMounted(() => {
    loadTeachers();
    activity.value.type = props.activityType;
    if (idActivity.value) {
        loadActivity(idActivity.value);
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <q-form
                class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
                @submit.prevent="onSubmit"
            >
                <q-input
                    :label="$t('shared.name')"
                    v-model="activity.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <template v-if="activity.type === ActivityType.CLASS">
                    <q-input
                        type="number"
                        :label="$t('activity.level')"
                        v-model.number="activity.level"
                        :rules="[
                            (val) =>
                                (val !== null &&
                                    val !== undefined &&
                                    val.toString().trim() !== '') ||
                                $t('shared.validations.required'),
                        ]"
                    />

                    <pd-select
                        :dense="false"
                        :options-dense="false"
                        v-model="activity.day"
                        :label="$t('shared.day') + '*'"
                        :options="weekDays"
                        :rules="[
                            (val: string) =>
                                (val && val.length > 0) ||
                                $t('shared.validations.required')
                        ]"
                    />
                </template>
                <template v-else-if="activity.type === ActivityType.EVENT">
                    <pd-date
                        :label="$t('activity.dateEvent')"
                        v-model="activity.dateEvent"
                        required
                    />
                </template>

                <div class="row">
                    <q-input
                        class="col-md-6 col-sm-6 col-xs-6 q-pr-md q-pr-sm"
                        :label="$t('activity.startHour')"
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
                        :label="$t('activity.endHour')"
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
                    :label="$t('activity.numberPlaces')"
                    v-model.number="activity.numberPlaces"
                    :rules="[
                        (val) =>
                            (val !== null &&
                                val !== undefined &&
                                val.toString().trim() !== '') ||
                            $t('shared.validations.required'),
                    ]"
                />

                <q-input
                    :label="$t('activity.color')"
                    v-model="activity.color"
                    class="col-md-11 col-sm-11 col-xs-10"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                        ]"
                >
                    <template v-slot:before>
                        <q-icon name="info">
                            <q-tooltip
                                anchor="center left"
                                self="center left"
                                :offset="[10, 10]"
                            >
                                {{ $t('activity.infoColor') }}
                            </q-tooltip>
                        </q-icon>
                    </template>
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
                        <div
                            name="event"
                            style="
                                width: 50px;
                                height: 50px;
                                border: 1px solid black;
                            "
                            :style="{ 'background-color': activity.color }"
                        ></div>
                    </template>
                </q-input>

                <q-select
                    v-model="activity.teachersIds"
                    multiple
                    :options="teachers"
                    :label="$t('activity.teachers')"
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
                    :label="$t('shared.save')"
                    color="primary"
                    class="full-width"
                    rounded
                    type="submit"
                />
            </q-form>
        </div>
    </q-page>
</template>
