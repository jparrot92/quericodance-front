import { api } from 'boot/axios';
import { User } from 'src/modules/admin/models/user';
import { handleError } from './errorApi';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listUsers = async (): Promise<User[]> => {
    try {
        const { data } = await api.get<User[]>('/users');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createUser = async (
    email: string,
    password: string
): Promise<User> => {
    try {
        const { data } = await api.post<User>('/users', {
            email,
            password
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
