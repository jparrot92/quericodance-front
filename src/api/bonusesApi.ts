import { api } from 'boot/axios';
import { handleError } from './errorApi';
import { BonusDTO } from 'src/model/bonus.model';
import { BonusStudentDTO } from 'src/model/student.model';

const bonusesEndpoint = '/bonuses';

export const listBonuses = async (): Promise<BonusDTO[]> => {
    try {
        const { data } = await api.get<BonusDTO[]>(bonusesEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getBonus = async (id: string): Promise<BonusDTO> => {
    try {
        const { data } = await api.get<BonusDTO>(`${bonusesEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createBonus = async (bonus: BonusDTO): Promise<BonusDTO> => {
    try {
        const { data } = await api.post<BonusDTO>(bonusesEndpoint, bonus);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateBonus = async (
    id: string,
    bonus: BonusDTO
): Promise<BonusDTO> => {
    try {
        const { data } = await api.put<BonusDTO>(
            `${bonusesEndpoint}/${id}`,
            bonus
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteBonus = async (id: number): Promise<BonusDTO> => {
    try {
        const { data } = await api.delete<BonusDTO>(`${bonusesEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createBonusStudent = async (
    studentId: number,
    bonusId: number
): Promise<BonusStudentDTO[]> => {
    try {
        const { data } = await api.post<BonusStudentDTO[]>(
            `${bonusesEndpoint}/student`,
            {
                studentId,
                bonusId,
            }
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteBonusStudent = async (
    id: number
): Promise<BonusStudentDTO[]> => {
    try {
        const { data } = await api.delete<BonusStudentDTO[]>(
            `${bonusesEndpoint}/student/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
