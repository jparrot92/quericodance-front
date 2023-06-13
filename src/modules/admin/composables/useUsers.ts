import { ref, onMounted } from 'vue';

import { listUsers } from 'src/api/userApi';

import useNotify from 'src/shared/composables/useNotify';

import { User } from '../models/user';

const useUsers = () => {
    const { notifyError } = useNotify();

    const loading = ref<boolean>(false);
    const users = ref<User[]>([]);

    const loadUsers = async () => {
        try {
            debugger;
            users.value = [];
            loading.value = true;
            users.value = await listUsers();
        } catch (error) {
            notifyError(error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        loadUsers();
    });

    return {
        // Properties
        loading,
        users,
        loadUsers
    };
};

export default useUsers;
