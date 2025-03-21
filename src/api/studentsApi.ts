import { api } from 'boot/axios';
import { handleError } from './errorApi';
import { StudentDTO } from 'src/model/student.model';

export const listStudents = async (
    idCourse: number | string
): Promise<StudentDTO[]> => {
    try {
        const params = idCourse ? { idCourse } : {};

        const { data } = await api.get<StudentDTO[]>('/students', { params });

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const getStudent = async (id: number): Promise<StudentDTO> => {
    try {
        const { data } = await api.get<StudentDTO>(`/students/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const createStudent = async (
    student: StudentDTO
): Promise<StudentDTO> => {
    try {
        const { data } = await api.post<StudentDTO>('/students', student);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const updateStudent = async (
    id: number,
    student: StudentDTO
): Promise<StudentDTO> => {
    try {
        const { data } = await api.put<StudentDTO>(`/students/${id}`, student);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const deleteStudent = async (id: number): Promise<StudentDTO> => {
    try {
        const { data } = await api.delete<StudentDTO>(`/students/${id}`);

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const sendMailPayment = async (id: number): Promise<StudentDTO> => {
    try {
        const { data } = await api.post<StudentDTO>(
            `/students/${id}/send-mail-payment`
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const downloadTemplateExcel = async () => {
    try {
        const response = await api.get('/students/template', {
            responseType: 'blob', // importante para manejar blobs
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Estudiantes_template.xlsx'); // el nombre con el que se descargará el archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Limpiar el DOM
    } catch (error) {
        throw handleError(error);
    }
};

export const uploadExcel = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post<string>(
            '/students/import-studients',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return data;
    } catch (error) {
        throw handleError(error);
    }
};

export const downloadExcel = async () => {
    try {
        const response = await api.get('/students/export', {
            responseType: 'blob', // importante para manejar blobs
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Estudiantes.xlsx'); // el nombre con el que se descargará el archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Limpiar el DOM
    } catch (error) {
        throw handleError(error);
    }
};
