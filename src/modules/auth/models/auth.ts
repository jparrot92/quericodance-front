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
    role: string;
    createAt: Date;
    updateAt: Date;
}

export interface UserInfo {
    id: number;
    email: string;
    roles: string;
    createAt: Date;
    updateAt: Date;
}
