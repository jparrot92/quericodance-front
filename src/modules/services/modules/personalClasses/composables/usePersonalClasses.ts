import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SessionFrequency, PaymentFrequency } from 'src/types/UtilTypes';

import useNotify from 'src/shared/composables/useNotify';

import {
    listPersonalClasses,
    getPersonalClass,
    createPersonalClass,
    updatePersonalClass,
    deletePersonalClass,
} from 'src/api/personalClassesApi';

import { PersonalClass } from '../models/personalClass';

const usePersonalClasses = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const personalClasses = ref<PersonalClass[]>([]);
    const personalClass = ref<PersonalClass>({
        id: 0,
        name: '',
        sessions: null,
        price: null,
        description: '',
    });

    const loadPersonalClasses = async () => {
        try {
            personalClasses.value = [];
            loading.value = true;
            personalClasses.value = await listPersonalClasses();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadPersonalClass = async (id: string) => {
        try {
            loading.value = true;
            personalClass.value = await getPersonalClass(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const savePersonalClass = async () => {
        try {
            loading.value = true;
            const personalClassData = await createPersonalClass(
                personalClass.value
            );
            notifySuccess(t('personalClass.createdSuccessfully'));
            router.replace({
                name: 'personalClasses-edit',
                params: { id: personalClassData.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editPersonalClass = async (id: string) => {
        try {
            loading.value = true;
            personalClass.value = await updatePersonalClass(
                id,
                personalClass.value
            );
            notifySuccess(t('personalClass.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removePersonalClass = async (id: string) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('personalClass.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deletePersonalClass(id);
                notifySuccess(t('personalClass.deleteSuccessfully'));
                await loadPersonalClasses();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        personalClasses,
        personalClass,
        loadPersonalClasses,
        loadPersonalClass,
        savePersonalClass,
        editPersonalClass,
        removePersonalClass,
    };
};

export default usePersonalClasses;
