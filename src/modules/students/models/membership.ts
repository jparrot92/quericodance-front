import { Tariff } from 'src/modules/services/modules/tariffs/models/tariff';

export interface MembershipDTO {
    id: number;
    studentId: number;
    tariffId: number;
    paymentFrequency: string;
    discountPercentage: number;
    discountReason: string;
}

export interface MembershipViewDTO {
    id?: number;
    payment?: number;
    paymentDate?: Date;
    paymentFrequency?: string;
    paymentStatus?: string;
    tariff?: Tariff;
    discountPercentage?: number;
    discountReason?: string;
    dueDate?: Date;
    updateAt?: Date;
}
