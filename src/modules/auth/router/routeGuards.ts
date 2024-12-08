import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { Role } from 'src/model/auth.model';
import { useAuthStore } from '../store/auth-store';

export const requireAuth = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore();

    const isAuthenticated = authStore.checkAuthentication();

    if (
        to.name !== 'login' &&
        to.name !== 'register' &&
        to.name !== 'forgot-password' &&
        to.name !== 'reset-password' &&
        !isAuthenticated
    )
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
