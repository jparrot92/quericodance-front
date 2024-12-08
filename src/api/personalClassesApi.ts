import { api } from 'boot/axios';
import { handleError } from './errorApi';
import { PersonalClassDTO } from 'src/model/personalClasses.model';

const personalClassesEndpoint = '/personal-classes';

export const listPersonalClasses = async (): Promise<PersonalClassDTO[]> => {
    try {
        const { data } = await api.get<PersonalClassDTO[]>(
            personalClassesEndpoint
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getPersonalClass = async (
    id: string
): Promise<PersonalClassDTO> => {
    try {
        const { data } = await api.get<PersonalClassDTO>(
            `${personalClassesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createPersonalClass = async (
    personalClass: PersonalClassDTO
): Promise<PersonalClassDTO> => {
    try {
        const { data } = await api.post<PersonalClassDTO>(
            personalClassesEndpoint,
            personalClass
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updatePersonalClass = async (
    id: string,
    personalClass: PersonalClassDTO
): Promise<PersonalClassDTO> => {
    try {
        const { data } = await api.put<PersonalClassDTO>(
            `${personalClassesEndpoint}/${id}`,
            personalClass
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deletePersonalClass = async (
    id: string
): Promise<PersonalClassDTO> => {
    try {
        const { data } = await api.delete<PersonalClassDTO>(
            `${personalClassesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
