import { api } from 'boot/axios';
import { User } from 'src/modules/user/models/user';
import { handleError } from './errorApi';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const getProfile = async (): Promise<User> => {
    try {
        const { data } = await api.get<User>('/profile');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateProfile = async (user: User): Promise<User> => {
    try {
        const { data } = await api.put<User>('/profile', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
