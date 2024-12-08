import { StudentDTO } from './student.model';

export interface AuthDTO {
    email: string;
    password: string;
}

export interface LoginDTO {
    token: string;
    user: UserDTO;
    expiresIn: string;
}

export interface UserDTO {
    id: number;
    email: string;
    roles: string[];
    createAt: Date;
    updateAt: Date;
    student?: StudentDTO;
}

export enum Role {
    ADMIN = 'admin',
    SECRETARY = 'secretary',
    TEACHER = 'teacher',
    STUDENT = 'student',
}
