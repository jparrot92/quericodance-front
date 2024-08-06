import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import useAuth from 'src/modules/auth/composables/useAuth';
import { Role } from '../models/roles';

export const requireAuth = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore();

    const isAuthenticated = authStore.checkAuthentication();

    if (to.name !== 'login' && to.name !== 'register' && !isAuthenticated)
        next({ name: 'login' });
    else next();
};

export const requireAdmin = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore();

    const isAdmin = authStore.user?.roles.includes(Role.ADMIN);

    if (isAdmin) {
        next();
    } else {
        next('/');
    }
};
