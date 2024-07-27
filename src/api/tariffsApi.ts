import { api } from 'boot/axios';
import { Tariff } from 'src/modules/services/modules/tariffs/models/tariff';
import { handleError } from './errorApi';

const tariffsEndpoint = '/tariffs';

export const listTariffs = async (): Promise<Tariff[]> => {
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

export const deleteTariff = async (id: string): Promise<Tariff> => {
    try {
        const { data } = await api.delete<Tariff>(`${tariffsEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
