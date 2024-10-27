import { api } from 'boot/axios';
import { UserDTO } from 'src/interfaces/user/user';
import { handleError } from './errorApi';

export const listUsers = async (): Promise<UserDTO[]> => {
    try {
        const { data } = await api.get<UserDTO[]>('/users');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getUser = async (id: string): Promise<UserDTO> => {
    try {
        const { data } = await api.get<UserDTO>(`/users/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createUser = async (user: UserDTO): Promise<UserDTO> => {
    try {
        const { data } = await api.post<UserDTO>('/users', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateUser = async (
    id: string,
    user: UserDTO
): Promise<UserDTO> => {
    try {
        const { data } = await api.put<UserDTO>(`/users/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const uploadPhoto = async (id: number, file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<{ imageUrl: string }>(
            `/users/${id}/profile-picture`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data.imageUrl;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteUser = async (id: number): Promise<UserDTO> => {
    try {
        const { data } = await api.delete<UserDTO>(`/users/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deletePhoto = async (id: number): Promise<UserDTO> => {
    try {
        const { data } = await api.delete<UserDTO>(
            `/users/${id}/profile-picture`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
