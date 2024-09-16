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
    createBonusStudent,
    deleteBonusStudent,
} from 'src/api/bonusesApi';

import { Bonus } from '../models/bonus';
import { BonusStudentDTO } from 'src/modules/students/models/bonusStudent';

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

    const saveBonusStudent = async (studentId: number, bonusId: number) => {
        try {
            const newListActivityStudent: BonusStudentDTO[] =
                await createBonusStudent(studentId, bonusId);

            return newListActivityStudent;
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeBonusStudent = async (id: number) => {
        return new Promise<BonusStudentDTO[]>((resolve, reject) => {
            $q.dialog({
                title: t('activity.confirmation'),
                message: t('activity.message.activityDelete'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                try {
                    const studentActivitiesList = await deleteBonusStudent(id);
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
        bonuses,
        bonus,
        loadBonuses,
        loadBonus,
        saveBonus,
        editBonus,
        removeBonus,
        saveBonusStudent,
        removeBonusStudent,
    };
};

export default useBonuses;
