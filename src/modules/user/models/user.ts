export interface User {
    id: number;
    nif: string;
    name: string;
    surnames: string;
    dateOfBirth: string;
    phone: string;
    photo: string;
    email: string;
    password?: string;
    role: string;
    address: Address;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
