import { api } from 'boot/axios';
import { handleError } from './errorApi';
import {
    AbsenceDTO,
    CourseCountersDTO,
    CourseDTO,
    CourseStudentDTO,
} from 'src/model/activity.model';

const coursesEndpoint = '/courses';

export const listCourses = async (): Promise<CourseDTO[]> => {
    try {
        const { data } = await api.get<CourseDTO[]>(coursesEndpoint);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getCountersCourse = async (
    id: number
): Promise<CourseCountersDTO> => {
    try {
        const { data } = await api.get<CourseCountersDTO>(
            `${coursesEndpoint}/${id}/counters`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getCourse = async (id: string): Promise<CourseDTO> => {
    try {
        const { data } = await api.get<CourseDTO>(`${coursesEndpoint}/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createCourse = async (course: CourseDTO): Promise<CourseDTO> => {
    try {
        const { data } = await api.post<CourseDTO>(coursesEndpoint, course);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateCourse = async (
    id: string,
    course: CourseDTO
): Promise<CourseDTO> => {
    try {
        const { data } = await api.put<CourseDTO>(
            `${coursesEndpoint}/${id}`,
            course
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteCourse = async (id: number): Promise<CourseDTO> => {
    try {
        const { data } = await api.delete<CourseDTO>(
            `${coursesEndpoint}/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createCourseStudent = async (
    studentId: number,
    activityId: number,
    danceRole: string
): Promise<CourseStudentDTO> => {
    try {
        const requestData = {
            studentId,
            activityId,
            danceRole,
        };

        const { data } = await api.post<CourseStudentDTO>(
            `${coursesEndpoint}/student`,
            requestData
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createCourseAbsence = async (
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
            `${coursesEndpoint}/absences`,
            requestData
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteCourseStudent = async (
    id: number
): Promise<CourseStudentDTO> => {
    try {
        const { data } = await api.delete<CourseStudentDTO>(
            `${coursesEndpoint}/student/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteCourseAbsence = async (id: number): Promise<AbsenceDTO> => {
    try {
        const { data } = await api.delete<AbsenceDTO>(
            `${coursesEndpoint}/absences/${id}`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const downloadExcel = async () => {
    try {
        const response = await api.get(`${coursesEndpoint}/export`, {
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
