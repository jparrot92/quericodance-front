import { api } from 'boot/axios';
import { Doctor } from 'src/modules/doctor/models/doctor';
import { handleError } from './errorApi';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listDoctors = async (): Promise<Doctor[]> => {
    try {
        const { data } = await api.get<Doctor[]>('/doctors');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getDoctor = async (id: string): Promise<Doctor> => {
    try {
        const { data } = await api.get<Doctor>(`/doctors/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createDoctor = async (user: Doctor): Promise<Doctor> => {
    try {
        const { data } = await api.post<Doctor>('/doctors', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateDoctor = async (
    id: string,
    user: Doctor
): Promise<Doctor> => {
    try {
        const { data } = await api.put<Doctor>(`/doctors/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteDoctor = async (id: string): Promise<Doctor> => {
    try {
        const { data } = await api.delete<Doctor>(`/doctors/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
