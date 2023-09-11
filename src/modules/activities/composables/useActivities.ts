import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    createActivityStudent
} from 'src/api/activitiesApi';

import { Activity } from '../models/activity';
import { ActivityStudent } from 'src/modules/students/models/activityStudent';

const useActivities = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const activities = ref<Activity[]>([]);
    const activity = ref<Activity>({
        id: 0,
        name: '',
        level: 0,
        day: '',
        startHour: '',
        endHour: '',
        numberPlaces: 0,
        price: 0,
        description: ''
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

    const loadActivity = async (id: string) => {
        try {
            loading.value = true;
            activity.value = await getActivity(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveActivity = async () => {
        try {
            loading.value = true;
            await createActivity(activity.value);
            notifySuccess(
                t('activity.notifications.activityUpdateSuccessfully')
            );
            router.push({ name: 'activities-list' });
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
            router.push({ name: 'activities-list' });
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
            persistent: true
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

    const saveActivityStudent = async (activityStudent: ActivityStudent) => {
        try {
            await createActivityStudent(activityStudent);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    return {
        // Properties
        loading,
        activities,
        activity,
        loadActivities,
        loadActivity,
        saveActivity,
        editActivity,
        removeActivity,
        saveActivityStudent
    };
};

export default useActivities;
