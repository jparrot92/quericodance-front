import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SessionFrequency, PaymentFrequency } from 'src/types/UtilTypes';

import useNotify from 'src/shared/composables/useNotify';

import {
    listPasses,
    getTariff,
    createTariff,
    updateTariff,
    deleteTariff,
} from 'src/api/passesApi';

import { Pass } from '../models/pass';

const usePasses = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const passes = ref<Pass[]>([]);
    const tariff = ref<Pass>({
        id: 0,
        name: '',
        sessions: null,
        sessionFrequency: SessionFrequency.WEEKLY,
        paymentFrequency: PaymentFrequency.MONTHLY,
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

    const loadTariff = async (id: string) => {
        try {
            loading.value = true;
            tariff.value = await getTariff(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveTariff = async () => {
        try {
            loading.value = true;
            const tariffData = await createTariff(tariff.value);
            notifySuccess(t('tariff.createdSuccessfully'));
            router.replace({
                name: 'passes-edit',
                params: { id: tariffData.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editTariff = async (id: string) => {
        try {
            loading.value = true;
            tariff.value = await updateTariff(id, tariff.value);
            notifySuccess(t('tariff.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeTariff = async (id: string) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('tariff.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deleteTariff(id);
                notifySuccess(t('tariff.deleteSuccessfully'));
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
        tariff,
        loadPasses,
        loadTariff,
        saveTariff,
        editTariff,
        removeTariff,
    };
};

export default usePasses;
