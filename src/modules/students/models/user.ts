interface Activity {
    id: number;
    name: string;
    level: number;
    day: string;
    startHour: string;
    endHour: string;
    numberPlaces: number;
    color: string;
}

interface ActivityStudent {
    id: number;
    danceRole: string;
    activity: Activity;
}

interface Membership {
    id: number;
    paymentFrequency: string;
    payment: string;
    paymentStatus: string;
    paymentDate: string;
    dueDate: string;
    discountPercentage: number;
    discountReason: string;
    createAt: string;
    updateAt: string;
    tariff: Tariff;
}

interface Tariff {
    id: number;
    name: string;
    sessions: number;
    sessionFrequency: string;
    price: number;
    description: string;
}

interface Student {
    id: number;
    observations: string | null;
    status: string;
    createAt: string;
    updateAt: string;
    activitiesStudent: ActivityStudent[];
    bonusesStudent: any[]; // Puedes definir el tipo exacto si tienes más detalles
    membership: Membership;
}

export interface UserViewDTO {
    id: number;
    name: string;
    surnames: string;
    dateOfBirth: string;
    phone: string;
    photo: string;
    instagram: string;
    email: string;
    password: string;
    resetPasswordToken?: string | null;
    active?: boolean;
    activationToken?: string | null;
    roles: string[];
    student?: Student;
}

export interface UserDTO {
    id: number;
    name: string;
    surnames: string;
    dateOfBirth: string;
    phone: string;
    photo: string;
    instagram: string;
    email: string;
    password: string;
    roles: string[];
}
