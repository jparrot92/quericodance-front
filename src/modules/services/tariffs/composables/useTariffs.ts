import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SessionFrequency, PaymentFrequency } from 'src/types/UtilTypes';

import useNotify from 'src/shared/composables/useNotify';

import {
    listTariffs,
    getTariff,
    createTariff,
    updateTariff,
    deleteTariff,
} from 'src/api/tariffsApi';

import { Tariff } from '../models/tariff';

const useTariffs = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const tariffs = ref<Tariff[]>([]);
    const tariff = ref<Tariff>({
        id: 0,
        name: '',
        sessions: null,
        sessionFrequency: SessionFrequency.WEEKLY,
        paymentFrequency: PaymentFrequency.MONTHLY,
        price: null,
        description: '',
    });

    const loadTariffs = async () => {
        try {
            tariffs.value = [];
            loading.value = true;
            tariffs.value = await listTariffs();
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
                name: 'tariffs-edit',
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
                await loadTariffs();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        tariffs,
        tariff,
        loadTariffs,
        loadTariff,
        saveTariff,
        editTariff,
        removeTariff,
    };
};

export default useTariffs;
