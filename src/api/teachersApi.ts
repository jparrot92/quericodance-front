import { api } from 'boot/axios';
import { Teacher } from 'src/modules/teachers/models/teacher';
import { handleError } from './errorApi';

export const listTeachers = async (): Promise<Teacher[]> => {
    try {
        const { data } = await api.get<Teacher[]>('/teachers');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getTeacher = async (id: string): Promise<Teacher> => {
    try {
        const { data } = await api.get<Teacher>(`/teachers/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createTeacher = async (user: Teacher): Promise<Teacher> => {
    try {
        const { data } = await api.post<Teacher>('/teachers', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateTeacher = async (
    id: string,
    user: Teacher
): Promise<Teacher> => {
    try {
        const { data } = await api.put<Teacher>(`/teachers/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteTeacher = async (id: number): Promise<Teacher> => {
    try {
        const { data } = await api.delete<Teacher>(`/teachers/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
