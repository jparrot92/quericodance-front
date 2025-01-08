import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import eventsApi from 'src/api/eventsApi';

import { EventDTO } from 'src/model/activity.model';

import useNotify from 'src/shared/composables/useNotify';

const useEvents = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const events = ref<EventDTO[]>([]);
    const event = ref<EventDTO>({
        id: 0,
        name: '',
        dateEvent: new Date(),
        startHour: '',
        endHour: '',
        color: '',
    });

    const getEvents = async () => {
        try {
            events.value = [];
            loading.value = true;
            events.value = await eventsApi.getEvents();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const getEvent = async (id: string) => {
        try {
            loading.value = true;
            event.value = await eventsApi.getEvent(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const createEvent = async () => {
        try {
            loading.value = true;
            const expenseData = await eventsApi.createEvent(event.value);
            notifySuccess(t('event.createdSuccessfully'));
            router.replace({
                name: 'events-edit',
                params: { id: expenseData.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const updateEvent = async (id: string) => {
        try {
            loading.value = true;
            event.value = await eventsApi.updateEvent(id, event.value);
            notifySuccess(t('event.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const deleteEvent = async (id: number) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('event.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await eventsApi.deleteEvent(id);
                notifySuccess(t('event.deleteSuccessfully'));
                await getEvents();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        events,
        event,
        getEvents,
        getEvent,
        createEvent,
        updateEvent,
        deleteEvent,
    };
};

export default useEvents;
