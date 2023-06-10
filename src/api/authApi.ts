import axios, { AxiosError } from 'axios';
import { Login } from 'src/modules/auth/models/auth';
import { handleError } from './errorApi';

const authApi = axios.create({
    baseURL: 'http://localhost:3000/auth'
});

export const login = async (
    email: string,
    password: string
): Promise<Login> => {
    try {
        const { data } = await authApi.post<Login>('/login', {
            email,
            password
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
