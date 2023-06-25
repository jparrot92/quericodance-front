import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { getUser, createUser, updateUser } from 'src/api/userApi';

import useNotify from 'src/shared/composables/useNotify';

import { User, Address } from '../models/user';

const useUser = (id: string) => {
    const route = useRoute();
    const router = useRouter();

    const { t } = useI18n();

    const { notifyError, notifySuccess } = useNotify();

    const loading = ref<boolean>(false);
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

    const isUpdate = computed(() => route.params.id);

    const onSubmit = async () => {
        if (isUpdate.value) {
            editUser();
        } else {
            saveUser();
        }
    };

    const loadUser = async () => {
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
            notifySuccess(t('admin.notifications.userUpdateSuccessfully'));
            router.push({ name: 'admin-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    const editUser = async () => {
        try {
            loading.value = true;
            user.value = await updateUser(id, user.value);
            notifySuccess(t('admin.notifications.userUpdateSuccessfully'));
            router.push({ name: 'admin-page' });
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    return {
        // Properties
        loading,
        isUpdate,
        user,
        // Methods
        loadUser,
        onSubmit
    };
};

export default useUser;
