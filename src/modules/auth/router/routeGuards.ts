import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../store/auth-store';

export const requireAuth = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore();

    const isAuthenticated = authStore.checkAuthentication();
    if (isAuthenticated) {
        next();
    } else {
        next('/auth');
    }
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
