import { api } from 'boot/axios';
import { UserDTO } from 'src/interfaces/user/user';
import { handleError } from './errorApi';

const profileEndpoint = '/profile';

export const getProfile = async (id: number): Promise<UserDTO> => {
    try {
        const { data } = await api.get<UserDTO>(`${profileEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateProfile = async (
    id: number,
    user: UserDTO
): Promise<UserDTO> => {
    try {
        const { data } = await api.put<UserDTO>(
            `${profileEndpoint}/${id}`,
            user
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
