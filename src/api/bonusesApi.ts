import { api } from 'boot/axios';
import { Bonus } from 'src/modules/services/modules/bonuses/models/bonus';
import { handleError } from './errorApi';

const bonusesEndpoint = '/bonuses';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listBonuses = async (): Promise<Bonus[]> => {
    try {
        const { data } = await api.get<Bonus[]>(bonusesEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getBonus = async (id: string): Promise<Bonus> => {
    try {
        const { data } = await api.get<Bonus>(`${bonusesEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createBonus = async (bonus: Bonus): Promise<Bonus> => {
    try {
        const { data } = await api.post<Bonus>(bonusesEndpoint, bonus);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateBonus = async (id: string, bonus: Bonus): Promise<Bonus> => {
    try {
        const { data } = await api.put<Bonus>(
            `${bonusesEndpoint}/${id}`,
            bonus
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteBonus = async (id: string): Promise<Bonus> => {
    try {
        const { data } = await api.delete<Bonus>(`${bonusesEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
