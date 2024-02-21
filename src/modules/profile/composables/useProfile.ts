import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import { getProfile, updateProfile } from 'src/api/profileApi';

import { User } from '../models/user';

const useUsers = () => {
    const router = useRouter();

    const { t } = useI18n();

    const { notifySuccess, notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const users = ref<User[]>([]);
    const user = ref<User>({
        id: 0,
        name: '',
        surnames: '',
        dateOfBirth: '',
        phone: '',
        photo: '',
        instagram: '',
        email: '',
        password: '',
        role: '',
    });

    const loadProfile = async () => {
        try {
            loading.value = true;
            user.value = await getProfile();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editProfile = async () => {
        try {
            loading.value = true;
            user.value = await updateProfile(user.value);
            notifySuccess(t('user.notifications.userUpdateSuccessfully'));
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
