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
    createActivityAbsence,
    deleteActivityStudent,
    deleteActivityAbsence,
    downloadExcel,
} from 'src/api/activitiesApi';

import {
    ActivityDTO,
    ActivityCounters,
    ActivityList,
} from '../models/activity';
import { ActivityStudent } from '../models/activityStudent';
import { ActivityType } from 'src/types/UtilTypes';

const useActivities = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const activities = ref<ActivityList[]>([]);
    const activity = ref<ActivityDTO>({
        id: 0,
        type: ActivityType.CLASS,
        name: '',
        level: null,
        day: null,
        startHour: '',
        endHour: '',
        dateEvent: '',
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
            ...activity.value,
        },
    });

    const activityCounters = ref<ActivityCounters>({
        numberStudents: '0',
        numberLeaders: '0',
        numberFollowers: '0',
        totalPaid: '0',
        costEffectiveness: '0',
    });

    const loadActivities = async (type?: string) => {
        try {
            activities.value = [];
            loading.value = true;
            activities.value = await listActivities(type);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadCountersActivity = async (id: number) => {
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
            notifySuccess(t('activity.messageActivityCreateSuccessfully'));
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
            notifySuccess(t('activity.messageActivityUpdateSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeActivity = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('activity.messageActivityDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteActivity(id);
                    notifySuccess(
                        t('activity.messageActivityDeleteSuccessfully')
                    );
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
    };

    const saveActivityStudent = async (
        studentId: number,
        activityId: number,
        danceRole: string
    ) => {
        try {
            const newActivityStudent: ActivityStudent =
                await createActivityStudent(studentId, activityId, danceRole);

            return newActivityStudent;
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveActivityAbsence = async (
        studentId: number,
        activityId: number,
        absenceDate: string
    ) => {
        loading.value = true;
        try {
            return await createActivityAbsence(
                studentId,
                activityId,
                absenceDate
            );
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeActivityStudent = async (id: number) => {
        return new Promise<void>((resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('activity.messageActivityDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteActivityStudent(id);
                    notifySuccess(t('activity.messageActivityDelete'));
                    resolve(); // Resuelve la promesa después de que todo esté completo
                } catch (error) {
                    notifyError(error);
                    reject(error); // Rechaza la promesa en caso de error
                }
            });
        });
    };

    const removeActivityAbsence = async (id: number) => {
        return new Promise<void>(async (resolve, reject) => {
            $q.dialog({
                title: t('shared.confirmation'),
                message: t('activity.removeActivityAbsence'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    await deleteActivityAbsence(id);
                    notifySuccess(t('activity.absenceDeleteSuccessfully'));
                    resolve();
                } catch (error) {
                    notifyError(error);
                    reject(error);
                }
            });
        });
    };

    const handleFileDownload = async () => {
        try {
            $q.loading.show({
                message: t('shared.loading'),
            });
            await downloadExcel();
            notifySuccess('Excel descargado');
        } catch (error) {
            notifyError(error);
        } finally {
            $q.loading.hide();
        }
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
        saveActivityAbsence,
        removeActivityStudent,
        removeActivityAbsence,
        handleFileDownload,
    };
};

export default useActivities;
