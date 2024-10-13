import { Tariff } from 'src/modules/services/modules/tariffs/models/tariff';
import { PaymentFrequency, PaymentsStatus } from 'src/types/UtilTypes';

export interface MembershipDTO {
    id: number;
    studentId: number;
    tariffId: number;
    paymentFrequency: string;
    discountPercentage: number;
    discountReason: string;
}

export interface MembershipViewDTO {
    id: number;
    payment: number;
    paymentDate?: Date;
    paymentFrequency: PaymentFrequency;
    paymentStatus: PaymentsStatus;
    tariff: Tariff;
    discountPercentage?: number;
    discountReason?: string;
    dueDate: Date;
    updateAt: Date;
}
