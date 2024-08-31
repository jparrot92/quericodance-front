<script setup lang="ts">
import { onMounted, defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import MenuList from 'src/shared/components/MenuList.vue';

import { useAuthStore } from '../../auth/store/auth-store';
import useAuth from '../../auth/composables/useAuth';

import useActivities from 'src/modules/activities/composables/useActivities';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import AddActivityStudentDialog from '../components/AddActivityStudentDialog.vue';

const emits = defineEmits(['update-activities-student']);

const props = withDefaults(
    defineProps<{
        idStudent: number;
        hasMembership: boolean;
        activitiesStudent?: ActivityStudent[];
    }>(),
    {}
);

const { t } = useI18n();
const { isStudent, isAdmin } = useAuth();
const authStore = useAuthStore();
const { removeActivityStudent } = useActivities();

const hasMembership = ref<boolean>(props.hasMembership);
const studentActivitiesList = ref<ActivityStudent[]>(
    props.activitiesStudent || []
);

const showModalAddActivity = ref(false);

const addActivityStudent = (activitiesStudent: ActivityStudent[]) => {
    studentActivitiesList.value = activitiesStudent;
    emits('update-activities-student', activitiesStudent);
};

const deleteActivityStudent = async (id: number) => {
    try {
        const activitiesStudent = await removeActivityStudent(id);
        studentActivitiesList.value = activitiesStudent;
        emits('update-activities-student', activitiesStudent);
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    studentActivitiesList.value = props.activitiesStudent || [];
    if (isStudent()) {
        hasMembership.value = authStore.user?.student?.membership
            ? true
            : false;
        studentActivitiesList.value =
            authStore.user?.student.activitiesStudent || [];
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <template v-if="hasMembership">
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

                                <q-item-section top side v-if="isAdmin()">
                                    <div class="text-grey-8 q-gutter-xs">
                                        <menu-list>
                                            <q-item clickable v-close-popup>
                                                <q-item-section
                                                    @click="
                                                        $router.push({
                                                            name: 'activities-list-students',
                                                            params: {
                                                                id: item
                                                                    .activity
                                                                    .id,
                                                            },
                                                        })
                                                    "
                                                >
                                                    {{
                                                        $t('activity.label.see')
                                                    }}
                                                </q-item-section>
                                            </q-item>
                                            <q-item clickable v-close-popup>
                                                <q-item-section
                                                    @click="
                                                        deleteActivityStudent(
                                                            item.id
                                                        )
                                                    "
                                                >
                                                    {{
                                                        $t(
                                                            'activity.label.delete'
                                                        )
                                                    }}
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

                    <q-card flat v-else>
                        <q-banner class="bg-info text-white">
                            {{ $t('student.messageAddCourse') }}
                        </q-banner>
                    </q-card>
                    <q-btn
                        v-if="isAdmin()"
                        :label="$t('student.addActivity')"
                        color="primary"
                        class="full-width"
                        rounded
                        @click="showModalAddActivity = true"
                    />
                </template>
                <template v-else>
                    <q-card flat>
                        <q-banner class="bg-info text-white">
                            {{ $t('student.messageNotMembership') }}
                        </q-banner>
                    </q-card>
                </template>
            </div>
        </div>
    </q-page>

    <AddActivityStudentDialog
        v-if="isAdmin()"
        :is-open="showModalAddActivity"
        :id-student="props.idStudent"
        @on-close="showModalAddActivity = false"
        @add-activity-student="addActivityStudent"
    />
</template>
