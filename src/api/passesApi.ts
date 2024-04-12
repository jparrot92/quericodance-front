import { api } from 'boot/axios';
import { Tariff } from 'src/modules/tariffs/models/tariff';
import { handleError } from './errorApi';

const tariffsEndpoint = '/tariffs';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listPasses = async (): Promise<Tariff[]> => {
    try {
        const { data } = await api.get<Tariff[]>(tariffsEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getTariff = async (id: string): Promise<Tariff> => {
    try {
        const { data } = await api.get<Tariff>(`${tariffsEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createTariff = async (tariff: Tariff): Promise<Tariff> => {
    try {
        const { data } = await api.post<Tariff>(tariffsEndpoint, tariff);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateTariff = async (
    id: string,
    tariff: Tariff
): Promise<Tariff> => {
    try {
        const { data } = await api.put<Tariff>(
            `${tariffsEndpoint}/${id}`,
            tariff
        );

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
            `${tariffsEndpoint}/${id}/profile-picture`,
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

export const deleteTariff = async (id: string): Promise<Tariff> => {
    try {
        const { data } = await api.delete<Tariff>(`${tariffsEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deletePhoto = async (id: number): Promise<Tariff> => {
    try {
        const { data } = await api.delete<Tariff>(
            `${tariffsEndpoint}/${id}/profile-picture`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
