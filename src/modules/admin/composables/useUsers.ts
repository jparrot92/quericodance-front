import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

import useNotify from 'src/shared/composables/useNotify';

import { listUsers, deleteUser } from 'src/api/userApi';

import { User } from '../models/user';

const useUsers = () => {
    const $q = useQuasar();

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

    const handleRemoveProduct = async (category: { name: any; id: string }) => {
        try {
            $q.dialog({
                title: 'Confirm',
                message: `Do you really delete ${category.name} ?`,
                cancel: true,
                persistent: true
            }).onOk(async () => {
                await deleteUser(category.id);
                notifySuccess('successfully deleted');
                loadUsers();
            });
        } catch (error) {
            notifyError(error);
        }
    };

    onMounted(() => {
        loadUsers();
    });

    return {
        // Properties
        loading,
        users,
        loadUsers,
        handleRemoveProduct
    };
};

export default useUsers;
