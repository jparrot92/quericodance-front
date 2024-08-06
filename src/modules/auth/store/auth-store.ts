import { defineStore } from 'pinia';

import { login } from 'src/api/authApi';

import { Auth, UserInfo } from '../models/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null as UserInfo | null,
        expiresIn: '',
    }),
    actions: {
        async login(user: Auth) {
            const { email, password } = user;

            try {
                const data = await login(email, password);

                localStorage.setItem('token', data.token);
                this.token = data.token;

                localStorage.setItem('user', JSON.stringify(data.user));
                this.user = data.user;

                localStorage.setItem('expiresIn', data.expiresIn);
                this.expiresIn = data.expiresIn;
            } catch (error) {
                throw error;
            }
        },
        checkAuthentication() {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            const expiresIn = localStorage.getItem('expiresIn');

            if (token && user && expiresIn) {
                const expirationDate: Date = new Date(parseInt(expiresIn, 10));
                const currentDate: Date = new Date();

                if (expirationDate > currentDate) {
                    this.token = token;
                    this.user = JSON.parse(user);
                    this.expiresIn = expiresIn;

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        logout() {
            this.token = '';
            this.user = null;
            this.expiresIn = '';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('expiresIn');
        },
    },
});
