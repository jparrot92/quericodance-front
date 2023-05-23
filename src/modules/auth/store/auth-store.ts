import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';

import authApi from 'src/api/authApi';
import { Login } from '../models/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: {},
        expiresIn: ''
    }),
    actions: {
        async login(email: string, password: string) {
            try {
                const { data } = await authApi.post<Login>('/login', {
                    email,
                    password
                });

                localStorage.setItem('token', data.token);
                this.token = data.token;

                localStorage.setItem('user', JSON.stringify(data.user));
                this.user = data.user;

                localStorage.setItem('expiresIn', data.expiresIn);
                this.expiresIn = data.expiresIn;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response) {
                        throw axiosError.response.data;
                    } else {
                        throw axiosError.message;
                    }
                } else {
                    throw error;
                }
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
                    this.user = user;
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
            this.user = {};
            this.expiresIn = '';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('expiresIn');
        }
    }
});
