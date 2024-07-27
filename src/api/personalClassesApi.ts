import { api } from 'boot/axios';
import { PersonalClass } from 'src/modules/services/modules/personalClasses/models/personalClass';
import { handleError } from './errorApi';

const personalClassesEndpoint = '/personal-classes';

export const listPersonalClasses = async (): Promise<PersonalClass[]> => {
    try {
        const { data } = await api.get<PersonalClass[]>(
            personalClassesEndpoint
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getPersonalClass = async (id: string): Promise<PersonalClass> => {
    try {
        const { data } = await api.get<PersonalClass>(
            `${personalClassesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createPersonalClass = async (
    personalClass: PersonalClass
): Promise<PersonalClass> => {
    try {
        const { data } = await api.post<PersonalClass>(
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
    personalClass: PersonalClass
): Promise<PersonalClass> => {
    try {
        const { data } = await api.put<PersonalClass>(
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
): Promise<PersonalClass> => {
    try {
        const { data } = await api.delete<PersonalClass>(
            `${personalClassesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
