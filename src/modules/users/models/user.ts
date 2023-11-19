export interface User {
    id: number;
    name: string;
    surnames: string;
    dateOfBirth: string;
    phone: string;
    photo: string;
    instagram: string;
    email: string;
    password?: string;
    active: boolean;
    roles: string[];
}
