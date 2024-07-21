import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listBonuses,
    getBonus,
    createBonus,
    updateBonus,
    deleteBonus,
} from 'src/api/bonusesApi';

import { Bonus } from '../models/bonus';

const useBonuses = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const bonuses = ref<Bonus[]>([]);
    const bonus = ref<Bonus>({
        id: 0,
        name: '',
        sessions: null,
        price: null,
        description: '',
    });

    const loadBonuses = async () => {
        try {
            bonuses.value = [];
            loading.value = true;
            bonuses.value = await listBonuses();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const loadBonus = async (id: string) => {
        try {
            loading.value = true;
            bonus.value = await getBonus(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveBonus = async () => {
        try {
            loading.value = true;
            const passData = await createBonus(bonus.value);
            notifySuccess(t('bonus.createdSuccessfully'));
            router.replace({
                name: 'bonuses-edit',
                params: { id: passData.id },
            });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editBonus = async (id: string) => {
        try {
            loading.value = true;
            bonus.value = await updateBonus(id, bonus.value);
            notifySuccess(t('bonus.updatedSuccessfully'));
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeBonus = async (id: string) => {
        $q.dialog({
            title: t('shared.confirmation'),
            message: t('bonus.delete'),
            cancel: true,
            persistent: true,
        }).onOk(async () => {
            try {
                await deleteBonus(id);
                notifySuccess(t('bonus.deleteSuccessfully'));
                await loadBonuses();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        bonuses,
        bonus,
        loadBonuses,
        loadBonus,
        saveBonus,
        editBonus,
        removeBonus,
    };
};

export default useBonuses;
