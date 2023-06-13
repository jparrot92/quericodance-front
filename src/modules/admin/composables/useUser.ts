import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

import { getUser, createUser, updateUser, deleteUser } from 'src/api/userApi';

import useNotify from 'src/shared/composables/useNotify';

import { User } from '../models/user';

import useUsers from '../composables/useUsers';

const useUser = (id: string) => {
    const route = useRoute();
    const router = useRouter();

    const { t } = useI18n();

    const $q = useQuasar();

    const { notifyError, notifySuccess } = useNotify();

    const { loadUsers } = useUsers();

    const loading = ref<boolean>(false);
    const user = ref<User>({
        nif: '',
        name: '',
        surnames: '',
        phone: '',
        photo: '',
        streetAddress: '',
        num: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        password: ''
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
                loadUsers();
            } catch (error) {
                notifyError(error);
            }
        });
    };

    onMounted(() => {
        if (isUpdate.value) {
            loadUser();
        }
    });

    return {
        // Properties
        loading,
        isUpdate,
        user,
        // Methods
        onSubmit,
        removeUser
    };
};

export default useUser;
