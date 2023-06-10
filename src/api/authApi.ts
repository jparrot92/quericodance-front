import { api } from 'boot/axios';
import { Login } from 'src/modules/auth/models/auth';
import { handleError } from './errorApi';

export const login = async (
    email: string,
    password: string
): Promise<Login> => {
    try {
        const { data } = await api.post<Login>('/auth/login', {
            email,
            password
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
