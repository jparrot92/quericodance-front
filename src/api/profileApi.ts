import { api } from 'boot/axios';
import { User } from 'src/modules/users/models/user';
import { handleError } from './errorApi';

const profileEndpoint = '/profile';

export const getProfile = async (id: number): Promise<User> => {
    try {
        const { data } = await api.get<User>(`${profileEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateProfile = async (id: number, user: User): Promise<User> => {
    try {
        const { data } = await api.put<User>(`${profileEndpoint}/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
