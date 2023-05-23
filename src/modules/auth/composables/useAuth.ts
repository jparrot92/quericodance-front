import { ref } from 'vue';
import { useRouter } from 'vue-router';

import useNotify from 'src/composables/useNotify';

import { useAuthStore } from '../store/auth-store';
import { Auth } from '../models/auth';

const useAuth = () => {
    const router = useRouter();

    const { notifyError, notifySuccess } = useNotify();

    const authStore = useAuthStore();

    const user = ref<Auth>({
        email: '',
        password: ''
    });

    const login = async () => {
        try {
            await authStore.login(user.value.email, user.value.password);
            notifySuccess('Login successfully!');
            router.push({ name: 'main' });
        } catch (error) {
            // Comprobar si el error es de tipo 'string' antes de manejarlo
            if (typeof error === 'string') {
                notifyError(error);
            } else if (
                error &&
                typeof error === 'object' &&
                'message' in error
            ) {
                notifyError(String(error.message));
            } else {
                console.error('Unknown error: ' + error);
            }
        }
    };

    const logout = async () => {
        authStore.logout();
        router.push({ name: 'login' });
    };

    return {
        // Properties
        user,
        // Methods
        login,
        logout
    };
};

export default useAuth;
