import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import { listUsers, deleteUser } from 'src/api/userApi';

import { User } from '../models/user';

const useUsers = () => {
    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const users = ref<User[]>([]);

    const loadUsers = async () => {
        try {
            users.value = [];
            loading.value = true;
            users.value = await listUsers();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeUser = async (id: string) => {
        $q.dialog({
            title: t('admin.label.confirmation'),
            message: t('admin.message.userDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deleteUser(id);
                notifySuccess(t('admin.notifications.userDeleteSuccessfully'));
                await loadUsers();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    return {
        // Properties
        loading,
        users,
        loadUsers,
        removeUser
    };
};

export default useUsers;
