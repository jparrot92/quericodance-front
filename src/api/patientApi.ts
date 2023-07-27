import { api } from 'boot/axios';
import { Patient } from 'src/modules/patient/models/patient';
import { handleError } from './errorApi';

api.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

export const listPatients = async (): Promise<Patient[]> => {
    try {
        const { data } = await api.get<Patient[]>('/patients');

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getPatient = async (id: string): Promise<Patient> => {
    try {
        const { data } = await api.get<Patient>(`/patients/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createPatient = async (user: Patient): Promise<Patient> => {
    try {
        const { data } = await api.post<Patient>('/patients', user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updatePatient = async (
    id: string,
    user: Patient
): Promise<Patient> => {
    try {
        const { data } = await api.put<Patient>(`/patients/${id}`, user);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deletePatient = async (id: string): Promise<Patient> => {
    try {
        const { data } = await api.delete<Patient>(`/patients/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};
