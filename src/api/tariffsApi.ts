import { api } from 'boot/axios';
import { TariffDTO } from 'src/interfaces/tariff/tariff';
import { handleError } from './errorApi';

const tariffsEndpoint = '/tariffs';

export const listTariffs = async (): Promise<TariffDTO[]> => {
    try {
        const { data } = await api.get<TariffDTO[]>(tariffsEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getTariff = async (id: string): Promise<TariffDTO> => {
    try {
        const { data } = await api.get<TariffDTO>(`${tariffsEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createTariff = async (tariff: TariffDTO): Promise<TariffDTO> => {
    try {
        const { data } = await api.post<TariffDTO>(tariffsEndpoint, tariff);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateTariff = async (
    id: string,
    tariff: TariffDTO
): Promise<TariffDTO> => {
    try {
        const { data } = await api.put<TariffDTO>(
            `${tariffsEndpoint}/${id}`,
            tariff
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteTariff = async (id: number): Promise<TariffDTO> => {
    try {
        const { data } = await api.delete<TariffDTO>(
            `${tariffsEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
