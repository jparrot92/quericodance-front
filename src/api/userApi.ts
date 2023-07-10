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

export const getUser = async (id: string): Promise<User> => {
    try {
        const { data } = await api.get<User>(`/users/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createUser = async (user: User): Promise<User> => {
    try {
        const { data } = await api.post<User>('/users', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateUser = async (id: string, user: User): Promise<User> => {
    try {
        const { data } = await api.put<User>(`/users/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const uploadPhoto = async (id: string, file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<{ imageUrl: string }>(
            `/users/${id}/profile-picture`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return data.imageUrl;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteUser = async (id: string): Promise<User> => {
    try {
        const { data } = await api.delete<User>(`/users/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
