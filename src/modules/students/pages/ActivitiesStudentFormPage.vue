<script setup lang="ts">
import { watch, onMounted, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useActivities from 'src/modules/activities/composables/useActivities';

import MenuList from 'src/shared/components/MenuList.vue';

const { t } = useI18n();

const { removeActivityStudent } = useActivities();

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

const addActivityStudent = (activitiesStudent: ActivityStudent[]) => {
    studentActivitiesList.value = activitiesStudent;
};

const deleteActivityStudent = async (id: number) => {
    try {
        const activitiesStudent = await removeActivityStudent(id);
        // La eliminación de la lista se realiza después de la eliminación exitosa en removeActivityStudent
        studentActivitiesList.value = activitiesStudent;
    } catch (error) {
        console.error(error);
    }
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
                                                'shared.enum.' +
                                                    item.activity.day
                                            )
                                        }}
                                        {{ item.activity.startHour }}
                                    </span>
                                </q-item-label>
                                <q-item-label caption lines="1">
                                    {{ item.danceRole }}
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top class="col-2">
                                <q-item-label>
                                    {{ item.price }} €
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <div class="text-grey-8 q-gutter-xs">
                                    <menu-list>
                                        <q-item clickable v-close-popup>
                                            <q-item-section
                                                @click="
                                                    $router.push({
                                                        name: 'activities-list-students',
                                                        params: {
                                                            id: item.activity
                                                                .id,
                                                        },
                                                    })
                                                "
                                            >
                                                {{ $t('activity.label.see') }}
                                            </q-item-section>
                                        </q-item>
                                    </menu-list>
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
