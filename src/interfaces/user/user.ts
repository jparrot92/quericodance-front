export interface UserDTO {
    id: number;
    name: string;
    surnames: string;
    dateOfBirth: string;
    phone: string;
    photo: string;
    instagram: string;
    email: string;
    password?: string;
    roles: string[];
}
