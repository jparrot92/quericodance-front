import { api } from 'boot/axios';
import { TeacherDTO } from 'src/interfaces/teacher/teacher';
import { handleError } from './errorApi';

export const listTeachers = async (): Promise<TeacherDTO[]> => {
    try {
        const { data } = await api.get<TeacherDTO[]>('/teachers');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getTeacher = async (id: string): Promise<TeacherDTO> => {
    try {
        const { data } = await api.get<TeacherDTO>(`/teachers/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createTeacher = async (user: TeacherDTO): Promise<TeacherDTO> => {
    try {
        const { data } = await api.post<TeacherDTO>('/teachers', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateTeacher = async (
    id: string,
    user: TeacherDTO
): Promise<TeacherDTO> => {
    try {
        const { data } = await api.put<TeacherDTO>(`/teachers/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteTeacher = async (id: number): Promise<TeacherDTO> => {
    try {
        const { data } = await api.delete<TeacherDTO>(`/teachers/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
