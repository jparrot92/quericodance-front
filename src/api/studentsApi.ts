import { api } from 'boot/axios';
import { Student } from 'src/modules/students/models/student';
import { handleError } from './errorApi';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listStudents = async (): Promise<Student[]> => {
    try {
        const { data } = await api.get<Student[]>('/students');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getStudent = async (id: string): Promise<Student> => {
    try {
        const { data } = await api.get<Student>(`/students/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createStudent = async (student: Student): Promise<Student> => {
    try {
        const { data } = await api.post<Student>('/students', student);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateStudent = async (
    id: string,
    student: Student
): Promise<Student> => {
    try {
        const { data } = await api.put<Student>(`/students/${id}`, student);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteStudent = async (id: string): Promise<Student> => {
    try {
        const { data } = await api.delete<Student>(`/students/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
