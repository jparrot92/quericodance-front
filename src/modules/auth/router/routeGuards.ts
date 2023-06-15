import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/auth-store';

export const requireAuth = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore();

    debugger;

    const isAuthenticated = authStore.checkAuthentication();

    if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' });
    else next();
};

export const requireAdmin = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const isAdmin = true;
    if (isAdmin) {
        next();
    } else {
        next('/');
    }
};
