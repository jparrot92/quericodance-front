<script setup lang="ts">
import { onMounted, defineProps, ref, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

import MenuList from 'src/shared/components/MenuList.vue';

import { useAuthStore } from '../../auth/store/auth-store';
import useAuth from '../../auth/composables/useAuth';

import { ActivityDTO } from 'src/modules/activities/models/activity';
import { AbsenceDTO } from 'src/modules/activities/models/absence';
import useActivities from 'src/modules/activities/composables/useActivities';
import { ActivityStudent } from 'src/modules/activities/models/activityStudent';
import AddActivityStudentDialog from '../components/AddActivityStudentDialog.vue';
import AddActivityAbsenceDialog from '../components/AddActivityAbsenceDialog.vue';
import AbsenceList from '../components/absence-list/AbsenceList.vue';

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
const { isStudent, isAdmin, refreshInfoStudent } = useAuth();
const authStore = useAuthStore();
const { removeActivityStudent, removeActivityAbsence } = useActivities();

const hasMembership = ref<boolean>(props.hasMembership);
const studentActivitiesList = ref<ActivityStudent[]>(
    props.activitiesStudent || []
);

const showModalAddActivity = ref(false);
const showModalAddActivityAbsence = ref(false);
const activityAbsence = ref<ActivityDTO>();

const showAbsenceList = ref<{ [key: number]: boolean }>({});

const messageNotMembership = computed<string>(() =>
    isStudent()
        ? t('student.messageNotMembershipStudent')
        : t('student.messageNotMembership')
);

const messageAddCourse = computed<string>(() =>
    isStudent()
        ? t('student.messageAddCourseStudent')
        : t('student.messageAddCourse')
);

const toggleAbsenceList = (activityId: number) => {
    showAbsenceList.value[activityId] = !showAbsenceList.value[activityId];
};

const addActivityStudent = (newActivityStudent: ActivityStudent) => {
    studentActivitiesList.value = [
        ...studentActivitiesList.value,
        newActivityStudent,
    ];

    emits('update-activities-student', studentActivitiesList.value);
};

const deleteActivityStudent = async (id: number) => {
    try {
        await removeActivityStudent(id);

        const updatedActivities = studentActivitiesList.value.filter(
            (activityStudent) => activityStudent.id !== id
        );

        studentActivitiesList.value = updatedActivities;

        emits('update-activities-student', updatedActivities);
    } catch (error) {
        console.error(error);
    }
};

const showActivityAbsence = async (activity: ActivityDTO) => {
    activityAbsence.value = activity;
    showModalAddActivityAbsence.value = true;
};

const addActivityAbsence = (absence: AbsenceDTO) => {
    if (!activityAbsence.value) {
        return;
    }

    // Actualizar la lista de actividades del estudiante
    const updatedActivities = studentActivitiesList.value.map(
        (activityStudent) => {
            if (activityStudent.activity.id === activityAbsence.value?.id) {
                // Solo agregar la ausencia si no está en la lista ya
                const updatedAbsences = activityStudent.activity.absences
                    ? [...activityStudent.activity.absences, absence]
                    : [absence];

                return {
                    ...activityStudent,
                    activity: {
                        ...activityStudent.activity,
                        absences: updatedAbsences,
                    },
                };
            }
            return activityStudent;
        }
    );

    studentActivitiesList.value = updatedActivities;

    emits('update-activities-student', studentActivitiesList.value);

    showModalAddActivityAbsence.value = false;
};

const handleRemoveActivityAbsence = async (absenceId: number) => {
    try {
        await removeActivityAbsence(absenceId);

        const updatedActivities = studentActivitiesList.value.map(
            (activityStudent) => {
                const updatedAbsences =
                    activityStudent.activity.absences?.filter(
                        (absence) => absence.id !== absenceId
                    );

                return {
                    ...activityStudent,
                    activity: {
                        ...activityStudent.activity,
                        absences: updatedAbsences,
                    },
                };
            }
        );

        studentActivitiesList.value = updatedActivities;

        emits('update-activities-student', studentActivitiesList.value);
    } catch (error) {
        console.error(error);
    }
};

const preventNav = async (event: BeforeUnloadEvent) => {
    await refreshInfoStudent();
    event.preventDefault();
    event.returnValue = '';
};

onMounted(() => {
    studentActivitiesList.value = props.activitiesStudent || [];
    if (isStudent()) {
        window.addEventListener('beforeunload', preventNav);
        hasMembership.value = authStore.user?.student?.membership
            ? true
            : false;
        studentActivitiesList.value =
            authStore.user?.student?.activitiesStudent || [];
    }
});

onBeforeUnmount(() => {
    if (isStudent()) {
        window.removeEventListener('beforeunload', preventNav);
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md">
                <template v-if="hasMembership">
                    <q-list
                        v-for="item in studentActivitiesList"
                        :key="item.id"
                        bordered
                        class="rounded-borders"
                    >
                        <q-item>
                            <q-item-section top>
                                <q-item-label lines="1">
                                    <span class="text-weight-medium">
                                        {{ $t('activity.activity') }}
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

                            <q-item-section top side>
                                <div class="text-grey-8 q-gutter-xs">
                                    <q-btn
                                        class="gt-xs"
                                        size="12px"
                                        flat
                                        @click="
                                            toggleAbsenceList(item.activity.id)
                                        "
                                        :label="$t('student.showAbsence')"
                                    >
                                        <q-badge
                                            v-if="item.activity.absences"
                                            color="red"
                                            floating
                                        >
                                            {{ item.activity.absences?.length }}
                                        </q-badge>
                                    </q-btn>
                                    <menu-list v-if="isAdmin()">
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
                                                {{ $t('activity.see') }}
                                            </q-item-section>
                                        </q-item>
                                        <q-item clickable v-close-popup>
                                            <q-item-section
                                                @click="
                                                    showActivityAbsence(
                                                        item.activity
                                                    )
                                                "
                                            >
                                                {{ $t('student.addAbsence') }}
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
                                                {{ $t('activity.delete') }}
                                            </q-item-section>
                                        </q-item>
                                    </menu-list>
                                </div>
                            </q-item-section>
                        </q-item>

                        <!-- Mostrar/ocultar la lista de ausencias basado en el estado -->
                        <absence-list
                            v-if="showAbsenceList[item.activity.id]"
                            :absences="item.activity.absences"
                            @delete-activities-absence="
                                handleRemoveActivityAbsence
                            "
                        />
                    </q-list>

                    <q-card flat v-if="studentActivitiesList.length === 0">
                        <q-banner class="bg-info text-white">
                            {{ messageAddCourse }}
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
                            {{ messageNotMembership }}
                        </q-banner>
                    </q-card>
                </template>
            </div>
        </div>
    </q-page>

    <AddActivityStudentDialog
        v-if="isAdmin() && showModalAddActivity"
        :id-student="props.idStudent"
        @close="showModalAddActivity = false"
        @add-activity-student="addActivityStudent"
    />
    <AddActivityAbsenceDialog
        v-if="isAdmin() && activityAbsence && showModalAddActivityAbsence"
        :id-student="props.idStudent"
        :activity-absence="activityAbsence"
        @close="showModalAddActivityAbsence = false"
        @add-activity-absence="addActivityAbsence"
    />
</template>
