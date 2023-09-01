import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import {
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from 'src/api/usersApi';

import { User } from '../models/user';

const useUsers = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const users = ref<User[]>([]);
    const user = ref<User>({
        id: 0,
        nif: '',
        name: '',
        surnames: '',
        dateOfBirth: '',
        phone: '',
        photo: '',
        email: '',
        password: '',
        role: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

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

    const loadUser = async (id: string) => {
        try {
            loading.value = true;
            user.value = await getUser(id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const saveUser = async () => {
        try {
            loading.value = true;
            await createUser(user.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
            router.push({ name: 'users' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editUser = async (id: string) => {
        try {
            loading.value = true;
            user.value = await updateUser(id, user.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
            router.push({ name: 'users' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const removeUser = async (id: string) => {
        $q.dialog({
            title: t('user.label.confirmation'),
            message: t('user.message.userDelete'),
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deleteUser(id);
                notifySuccess(t('user.notifications.userDeleteSuccessfully'));
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
        user,
        loadUsers,
        loadUser,
        saveUser,
        editUser,
        removeUser
    };
};

export default useUsers;
