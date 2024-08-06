import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

import useNotify from 'src/shared/composables/useNotify';

import { useAuthStore } from '../store/auth-store';
import { Auth } from '../models/auth';
import { Role } from '../models/roles';

const useAuth = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifyError, notifySuccess } = useNotify();

    const authStore = useAuthStore();

    const userForm = ref<Auth>({
        email: '',
        password: '',
    });

    const onSubmit = async () => {
        try {
            $q.loading.show({
                message: t('shared.loading'),
            });
            await authStore.login(userForm.value);
            notifySuccess(t('auth.loginSuccessfully'));
            router.push({ name: 'appointments-list' });
        } catch (error) {
            notifyError(error);
        } finally {
            $q.loading.hide();
        }
    };

    const logout = async () => {
        authStore.logout();
        router.push({ name: 'login' });
    };

    const roles = computed(() => authStore.user?.roles || []);

    const hasRole = (role) => roles.value.includes(role);

    const isAdmin = () => hasRole(Role.ADMIN);
    const isStudent = () => hasRole(Role.STUDENT);

    return {
        // Properties
        userForm,
        // Methods
        onSubmit,
        logout,
        hasRole,
        isAdmin,
        isStudent,
    };
};

export default useAuth;
