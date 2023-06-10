import axios, { AxiosError } from 'axios';

export const handleError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            throw axiosError.response.data;
        } else {
            throw axiosError.message;
        }
    } else {
        throw error;
    }
};
