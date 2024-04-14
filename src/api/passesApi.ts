import { api } from 'boot/axios';
import { Pass } from 'src/modules/services/modules/passes/models/pass';
import { handleError } from './errorApi';

const tariffsEndpoint = '/passes';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listPasses = async (): Promise<Pass[]> => {
    try {
        const { data } = await api.get<Pass[]>(tariffsEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getPass = async (id: string): Promise<Pass> => {
    try {
        const { data } = await api.get<Pass>(`${tariffsEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createPass = async (pass: Pass): Promise<Pass> => {
    try {
        const { data } = await api.post<Pass>(tariffsEndpoint, pass);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updatePass = async (id: string, pass: Pass): Promise<Pass> => {
    try {
        const { data } = await api.put<Pass>(`${tariffsEndpoint}/${id}`, pass);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deletePass = async (id: string): Promise<Pass> => {
    try {
        const { data } = await api.delete<Pass>(`${tariffsEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
