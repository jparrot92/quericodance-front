import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SessionFrequency, PaymentFrequency } from 'src/types/UtilTypes';

import useNotify from 'src/shared/composables/useNotify';

import {
    listPasses,
    getPass,
    createPass,
    updatePass,
    deletePass,
} from 'src/api/passesApi';

import { Pass } from '../models/pass';

const usePasses = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const passes = ref<Pass[]>([]);
    const pass = ref<Pass>({
        id: 0,
        name: '',
        sessions: null,
        price: null,
        description: '',
    });

    const loadPasses = async () => {
        try {
            passes.value = [];
            loading.value = true;
            passes.value = await listPasses();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadPass = async (id: string) => {
        try {
            loading.value = true;
            pass.value = await getPass(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const savePass = async () => {
        try {
            loading.value = true;
            const passData = await createPass(pass.value);
            notifySuccess(t('pass.createdSuccessfully'));
            router.replace({
                name: 'passes-edit',
                params: { id: passData.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editPass = async (id: string) => {
        try {
            loading.value = true;
            pass.value = await updatePass(id, pass.value);
            notifySuccess(t('pass.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removePass = async (id: string) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('pass.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deletePass(id);
                notifySuccess(t('pass.deleteSuccessfully'));
                await loadPasses();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        passes,
        pass,
        loadPasses,
        loadPass,
        savePass,
        editPass,
        removePass,
    };
};

export default usePasses;
