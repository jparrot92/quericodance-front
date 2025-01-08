<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import useEvents from '../composables/useEvents';

const route = useRoute();

const idEvent = computed<string | undefined>(() => route.params.id?.toString());

const { event, getEvent, createEvent, updateEvent } = useEvents();

const onSubmit = async () => {
    if (idEvent.value) {
        updateEvent(idEvent.value);
    } else {
        createEvent();
    }
};

onMounted(() => {
    if (idEvent.value) {
        getEvent(idEvent.value);
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
                    :label="$t('event.name') + '*'"
                    v-model="event.name"
                    :rules="[
                        (val: string) =>
                            (val && val.length > 0) ||
                            $t('shared.validations.required')
                    ]"
                />

                <pd-date
                    :label="$t('event.dateEvent') + '*'"
                    v-model="event.dateEvent"
                    required
                />

                <div class="row">
                    <q-input
                        class="col-md-6 col-sm-6 col-xs-6 q-pr-md q-pr-sm"
                        :label="$t('event.startHour')"
                        v-model="event.startHour"
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
                                    <q-time v-model="event.startHour">
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
                        :label="$t('event.endHour')"
                        v-model="event.endHour"
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
                                    <q-time v-model="event.endHour">
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
                    :label="$t('event.color')"
                    v-model="event.color"
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
                                {{ $t('event.infoColor') }}
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
                                <q-color v-model="event.color" />
                            </q-popup-proxy>
                        </q-icon>
                        <div
                            name="event"
                            style="
                                width: 50px;
                                height: 50px;
                                border: 1px solid black;
                            "
                            :style="{ 'background-color': event.color }"
                        ></div>
                    </template>
                </q-input>

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
