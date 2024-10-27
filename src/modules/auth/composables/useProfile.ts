import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { getProfile, updateProfile } from 'src/api/profileApi';

import { UserDTO } from 'src/interfaces/user/user';

import useNotify from 'src/shared/composables/useNotify';

import { useAuthStore } from 'src/modules/auth/store/auth-store';

const useUsers = () => {
    const router = useRouter();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const authStore = useAuthStore();

    const loading = ref<boolean>(false);
    const users = ref<UserDTO[]>([]);
    const user = ref<UserDTO>({
        id: 0,
        name: '',
        surnames: '',
        dateOfBirth: '',
        phone: '',
        photo: '',
        instagram: '',
        email: '',
        password: '',
        roles: [],
    });

    const loadProfile = async () => {
        if (authStore.user?.id === undefined) {
            notifyError(new Error('User ID is undefined'));
            return;
        }
        try {
            loading.value = true;
            user.value = await getProfile(authStore.user?.id);
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editProfile = async () => {
        if (authStore.user?.id === undefined) {
            notifyError(new Error('User ID is undefined'));
            return;
        }
        try {
            loading.value = true;
            user.value = await updateProfile(authStore.user?.id, user.value);
            notifySuccess(t('user.userUpdateSuccessfully'));
            router.push({ name: 'users-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    return {
        // Properties
        loading,
        users,
        user,
        loadProfile,
        editProfile,
    };
};

export default useUsers;
