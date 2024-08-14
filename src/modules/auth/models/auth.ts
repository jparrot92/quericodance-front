import { StudentDTO } from 'src/modules/students/models/student';

export interface Auth {
    email: string;
    password: string;
}

export interface Login {
    token: string;
    user: User;
    expiresIn: string;
}

export interface User {
    id: number;
    email: string;
    roles: string[];
    createAt: Date;
    updateAt: Date;
    student: StudentDTO;
}
