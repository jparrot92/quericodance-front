import { StudentDTO } from 'src/interfaces/student/student';

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
