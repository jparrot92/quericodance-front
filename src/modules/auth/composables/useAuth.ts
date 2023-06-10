import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useNotify from 'src/shared/composables/useNotify';

import { useAuthStore } from '../store/auth-store';
import { Auth } from '../models/auth';

const useAuth = () => {
    const router = useRouter();

    const { t } = useI18n();

    const { notifyError, notifySuccess } = useNotify();

    const authStore = useAuthStore();

    const userForm = ref<Auth>({
        email: '',
        password: ''
    });

    const onSubmit = async () => {
        try {
            await authStore.login(userForm.value);
            notifySuccess(t('auth.notifications.loginSuccessfully'));
            router.push({ name: 'appointments-page' });
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
        userForm,
        // Methods
        onSubmit,
        logout
    };
};

export default useAuth;
