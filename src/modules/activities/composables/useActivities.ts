import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listActivities,
    getCountersActivity,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    createActivityStudent,
    deleteActivityStudent,
} from 'src/api/activitiesApi';

import {
    ActivityForm,
    ActivityCounters,
    ActivityList,
} from '../models/activity';
import { ActivityStudent } from '../models/activityStudent';

const useActivities = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const activities = ref<ActivityList[]>([]);
    const activity = ref<ActivityForm>({
        id: 0,
        name: '',
        level: null,
        day: '',
        startHour: '',
        endHour: '',
        numberPlaces: null,
        price: null,
        color: '',
        teachersIds: [],
    });
    const activityStudent = ref<ActivityStudent>({
        id: 0,
        danceRole: '',
        price: 0,
        activity: {
            id: 0,
            name: '',
            level: 0,
            day: '',
            startHour: '',
            endHour: '',
            numberPlaces: 0,
            price: 0,
            color: '',
            teachersIds: [],
        },
    });

    const activityCounters = ref<ActivityCounters>({
        numberStudents: '0',
        numberLeaders: '0',
        numberFollowers: '0',
        totalPaid: '0',
        costEffectiveness: '0',
    });

    const loadActivities = async () => {
        try {
            activities.value = [];
            loading.value = true;
            activities.value = await listActivities();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadCountersActivity = async (id: string) => {
        try {
            loading.value = true;
            activityCounters.value = await getCountersActivity(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadActivity = async (id: string) => {
        try {
            loading.value = true;
            activity.value = await getActivity(id);

            if (activity.value.teachers) {
                activity.value.teachersIds =
                    activity.value.teachers.map((teacher) => teacher.id) || [];
            }
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveActivity = async () => {
        try {
            loading.value = true;
            activity.value = await createActivity(activity.value);
            notifySuccess(
                t('activity.notifications.activityCreateSuccessfully')
            );
            router.replace({
                name: 'activities-edit',
                params: { id: activity.value.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editActivity = async (id: string) => {
        try {
            loading.value = true;
            activity.value = await updateActivity(id, activity.value);
            notifySuccess(
                t('activity.notifications.activityUpdateSuccessfully')
            );
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeActivity = async (id: string) => {
        $q.dialog({
            title: t('activity.label.confirmation'),
            message: t('activity.message.activityDelete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deleteActivity(id);
                notifySuccess(
                    t('activity.notifications.activityDeleteSuccessfully')
                );
                await loadActivities();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    const saveActivityStudent = async (
        studentId: number,
        activityId: number,
        danceRole: string,
        price: number
    ) => {
        try {
            const newListActivityStudent: ActivityStudent[] =
                await createActivityStudent(
                    studentId,
                    activityId,
                    danceRole,
                    price
                );

            return newListActivityStudent;
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeActivityStudent = async (id: number) => {
        return new Promise<ActivityStudent[]>((resolve, reject) => {
            $q.dialog({
                title: t('activity.label.confirmation'),
                message: t('activity.message.activityDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    const studentActivitiesList = await deleteActivityStudent(
                        id
                    );
                    notifySuccess(
                        t('activity.notifications.activityDeleteSuccessfully')
                    );
                    resolve(studentActivitiesList); // Resuelve la promesa después de que todo esté completo
                } catch (error) {
                    notifyError(error);
                    reject(error); // Rechaza la promesa en caso de error
                }
            });
        });
    };

    return {
        // Properties
        loading,
        activities,
        activity,
        activityStudent,
        activityCounters,
        loadActivities,
        loadCountersActivity,
        loadActivity,
        saveActivity,
        editActivity,
        removeActivity,
        saveActivityStudent,
        removeActivityStudent,
    };
};

export default useActivities;
