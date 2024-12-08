import { api } from 'boot/axios';
import { handleError } from './errorApi';
import {
    AbsenceDTO,
    ActivityCountersDTO,
    ActivityDTO,
    ActivityStudentDTO,
} from 'src/model/activity.model';

const activitiesEndpoint = '/activities';

export const listActivities = async (type?: string): Promise<ActivityDTO[]> => {
    try {
        // Construir los parámetros de consulta si 'type' está presente
        const params = type ? { params: { type } } : {};

        const { data } = await api.get<ActivityDTO[]>(
            activitiesEndpoint,
            params
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getCountersActivity = async (
    id: number
): Promise<ActivityCountersDTO> => {
    try {
        const { data } = await api.get<ActivityCountersDTO>(
            `${activitiesEndpoint}/${id}/counters`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getActivity = async (id: string): Promise<ActivityDTO> => {
    try {
        const { data } = await api.get<ActivityDTO>(
            `${activitiesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createActivity = async (
    activity: ActivityDTO
): Promise<ActivityDTO> => {
    try {
        const { data } = await api.post<ActivityDTO>(
            activitiesEndpoint,
            activity
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateActivity = async (
    id: string,
    activity: ActivityDTO
): Promise<ActivityDTO> => {
    try {
        const { data } = await api.put<ActivityDTO>(
            `${activitiesEndpoint}/${id}`,
            activity
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteActivity = async (id: number): Promise<ActivityDTO> => {
    try {
        const { data } = await api.delete<ActivityDTO>(
            `${activitiesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createActivityStudent = async (
    studentId: number,
    activityId: number,
    danceRole: string
): Promise<ActivityStudentDTO> => {
    try {
        const requestData = {
            studentId,
            activityId,
            danceRole,
        };

        const { data } = await api.post<ActivityStudentDTO>(
            `${activitiesEndpoint}/student`,
            requestData
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createActivityAbsence = async (
    studentId: number,
    activityId: number,
    absenceDate: string
): Promise<AbsenceDTO> => {
    try {
        const requestData = {
            studentId,
            activityId,
            absenceDate,
        };

        const { data } = await api.post<AbsenceDTO>(
            `${activitiesEndpoint}/absences`,
            requestData
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteActivityStudent = async (
    id: number
): Promise<ActivityStudentDTO> => {
    try {
        const { data } = await api.delete<ActivityStudentDTO>(
            `${activitiesEndpoint}/student/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteActivityAbsence = async (
    id: number
): Promise<AbsenceDTO> => {
    try {
        const { data } = await api.delete<AbsenceDTO>(
            `${activitiesEndpoint}/absences/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const downloadExcel = async () => {
    try {
        const response = await api.get(`${activitiesEndpoint}/export`, {
            responseType: 'blob', // importante para manejar blobs
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Cursos.xlsx'); // el nombre con el que se descargará el archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Limpiar el DOM
    } catch (error) {
        throw handleError(error);
    }
};
