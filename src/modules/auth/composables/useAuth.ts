import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

import { requestResetPassword, updatePassword } from 'src/api/authApi';

import { AuthDTO, Role } from 'src/model/auth.model';

import useLocalStorageFilters from 'src/composables/useLocalStorageFilters';
import useNotify from 'src/shared/composables/useNotify';

import { useAuthStore } from '../store/auth-store';

const useAuth = () => {
    const router = useRouter();

    const $q = useQuasar();

    const { t } = useI18n();

    const { notifyError, notifySuccess } = useNotify();

    const { removeFiltersFromLocalStorage } = useLocalStorageFilters();

    const authStore = useAuthStore();

    const userForm = ref<AuthDTO>({
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

    const sendMailRequestResetPassword = async (email: string) => {
        try {
            await requestResetPassword(email);
            notifySuccess(t('auth.sendMailPaymentPaid'));
            router.push({ name: 'login' });
        } catch (error) {
            notifyError(error);
        }
    };

    const resetPassword = async (
        resetPasswordToken: string,
        password: string
    ) => {
        try {
            await updatePassword(resetPasswordToken, password);
            notifySuccess(t('auth.updatePassword'));
            router.push({ name: 'login' });
        } catch (error) {
            notifyError(error);
        }
    };

    const logout = async () => {
        authStore.logout();
        removeFiltersFromLocalStorage();
        router.push({ name: 'login' });
    };

    const refreshInfoStudent = async () => {
        await authStore.refreshInfoStudent();
    };

    const roles = computed(() => authStore.user?.roles || []);

    const hasRole = (role: string) => roles.value.includes(role);

    const isAdmin = () => hasRole(Role.ADMIN);
    const isStudent = () => hasRole(Role.STUDENT);

    return {
        // Properties
        userForm,
        // Methods
        onSubmit,
        sendMailRequestResetPassword,
        resetPassword,
        logout,
        refreshInfoStudent,
        hasRole,
        isAdmin,
        isStudent,
    };
};

export default useAuth;
