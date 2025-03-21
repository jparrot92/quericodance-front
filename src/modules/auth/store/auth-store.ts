import { defineStore } from 'pinia';

import { login } from 'src/api/authApi';
import { getStudent } from 'src/api/studentsApi';
import { AuthDTO, UserDTO } from 'src/model/auth.model';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null as UserDTO | null,
        expiresIn: '',
    }),
    actions: {
        async login(user: AuthDTO) {
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
        async refreshInfoStudent() {
            try {
                if (this.user?.student) {
                    const data = await getStudent(this.user.student.id);

                    this.user.student = data;

                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            } catch (error) {
                throw error;
            }
        },
    },
});
