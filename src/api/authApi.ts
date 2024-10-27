import { api } from 'boot/axios';
import { LoginDTO } from 'src/interfaces/auth/auth';
import { handleError } from './errorApi';

export const login = async (
    email: string,
    password: string
): Promise<LoginDTO> => {
    try {
        const { data } = await api.post<LoginDTO>('/auth/login', {
            email,
            password,
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const requestResetPassword = async (
    email: string
): Promise<LoginDTO> => {
    try {
        const { data } = await api.patch<LoginDTO>(
            '/auth/request-reset-password',
            {
                email,
            }
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updatePassword = async (
    resetPasswordToken: string,
    password: string
): Promise<LoginDTO> => {
    try {
        const { data } = await api.patch<LoginDTO>('/auth/reset-password', {
            resetPasswordToken,
            password,
        });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
