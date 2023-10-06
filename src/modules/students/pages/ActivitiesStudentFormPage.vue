<script setup lang="ts">
import { watch, onMounted, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

import { ActivityStudent } from 'src/modules/activities/models/activityStudent';

import AddActivityStudentDialog from '../components/AddActivityStudentDialog.vue';

interface Props {
    activitiesStudent?: ActivityStudent[];
    idStudent: number;
}

const props = defineProps<Props>();

const studentActivitiesList = ref<ActivityStudent[]>([]);
const idStudentDialog = ref<number>(0);

const showModalAddActivity = ref(false);

watch(
    () => props.activitiesStudent,
    (newActivitiesStudent) => {
        studentActivitiesList.value = newActivitiesStudent || [];
    }
);

watch(props, () => {
    idStudentDialog.value = props.idStudent;
});

onMounted(() => {
    studentActivitiesList.value = props.activitiesStudent || [];
    idStudentDialog.value = props.idStudent;
});

const addActivityStudent = (activityStudent: ActivityStudent) => {
    studentActivitiesList.value.push(activityStudent);
};
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <q-list
                    v-if="studentActivitiesList.length > 0"
                    bordered
                    class="rounded-borders"
                >
                    <template
                        v-for="(item, index) in studentActivitiesList"
                        :key="item.id"
                    >
                        <q-item>
                            <q-item-section top>
                                <q-item-label lines="1">
                                    <span class="text-weight-medium">
                                        {{ $t('activity.label.activity') }}
                                        {{ item.activity.name }}
                                        {{ item.activity.level }}
                                    </span>
                                    <span class="text-grey-8">
                                        -
                                        {{
                                            t(
                                                'shared.label.' +
                                                    item.activity.day
                                            )
                                        }}
                                        {{ item.activity.startHour }}
                                    </span>
                                </q-item-label>
                                <q-item-label caption lines="1">
                                    {{ item.danceRole }}
                                </q-item-label>
                                <q-item-label
                                    lines="1"
                                    class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
                                >
                                    <span class="cursor-pointer">
                                        Ver grupo
                                    </span>
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top class="col-2">
                                <q-item-label>
                                    {{ item.price }} €
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <div class="text-grey-8 q-gutter-xs">
                                    <q-btn
                                        size="12px"
                                        flat
                                        dense
                                        round
                                        icon="delete"
                                    />
                                </div>
                            </q-item-section>
                        </q-item>
                        <q-separator
                            spaced
                            v-if="index < studentActivitiesList.length - 1"
                        />
                    </template>
                </q-list>
                <q-banner v-else class="bg-primary text-white">
                    {{ $t('student.message.addCourse') }}
                </q-banner>
                <q-btn
                    :label="$t('student.label.addActivity')"
                    color="primary"
                    class="full-width"
                    rounded
                    @click="showModalAddActivity = true"
                />
            </div>
        </div>
    </q-page>

    <AddActivityStudentDialog
        :is-open="showModalAddActivity"
        :id-student="idStudentDialog"
        @on-close="showModalAddActivity = false"
        @add-activity-student="addActivityStudent"
    />
</template>
