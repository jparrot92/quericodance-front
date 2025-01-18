<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useCourses from 'src/modules/activities/composables/useCourses';

const props = withDefaults(
    defineProps<{
        idCourse: number;
    }>(),
    {}
);

const { activityCounters, loadCountersCourse } = useCourses();

const showProfitability = ref<boolean>(false);

onMounted(async () => {
    await loadCountersCourse(props.idCourse);
});
</script>
<template>
    <div class="col-12">
        <div class="row">
            <q-toggle
                class="h-2-5rem"
                :label="$t('course.showProfitability')"
                v-model="showProfitability"
            ></q-toggle>
        </div>

        <div class="row">
            <div class="q-pa-xs col-xs-6 col-sm-3 col-md-2">
                <q-card flat bordered>
                    <q-card-section
                        class="text-center bg-blue text-white q-pa-none"
                    >
                        {{ $t('course.numberLeaders') }}
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center q-pa-none">
                        <div>{{ activityCounters.numberLeaders }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="q-pa-xs col-xs-6 col-sm-3 col-md-2">
                <q-card flat bordered>
                    <q-card-section
                        class="text-center bg-pink text-white q-pa-none"
                    >
                        {{ $t('course.numberFollowers') }}
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center q-pa-none">
                        <div>{{ activityCounters.numberFollowers || 0 }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <template v-if="showProfitability">
                <div class="q-pa-xs col-xs-6 col-sm-3 col-md-2">
                    <q-card flat bordered>
                        <q-card-section
                            class="text-center bg-red text-white q-pa-none"
                        >
                            {{ $t('course.costEffectiveness') }}
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="flex flex-center q-pa-none">
                            <div>
                                {{ activityCounters.costEffectiveness || 0 }} €
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="q-pa-xs col-xs-6 col-sm-3 col-md-2">
                    <q-card flat bordered>
                        <q-card-section
                            class="text-center bg-green text-white q-pa-none"
                        >
                            {{ $t('course.totalPaid') }}
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="flex flex-center q-pa-none">
                            <div>{{ activityCounters.totalPaid || 0 }} €</div>
                        </q-card-section>
                    </q-card>
                </div>
            </template>
        </div>
    </div>
</template>
